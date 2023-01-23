import type { Prisma } from '@prisma/client'
import { getAssetDeploymentByContractAddressAndChainId } from '@server/common/db-get-asset-deployment-by-production-branch'
import { getTotalSupply } from '@server/common/ethers-get-contract-total-supply'
import { createTokenImageBuffer } from '@server/common/gcp-create-token-image-buffer'
import { getImageUrlFromGcp } from '@server/common/gcp-get-token-image-url'
import { saveImageToGcp } from '@server/common/gcp-save-token-image-buffer'
import { getImageTokenFromAssetDeployment } from '@server/common/v-create-token-hash'
import type { NextApiRequest, NextApiResponse } from 'next'
import type * as v from 'src/shared/compiler'

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  /** Inputs */
  const { chainId: cid, address, id } = req.query as { chainId: string; address: string; id: string }
  const tokenId = parseInt(id)
  const chainId = parseInt(cid)
  if (!chainId || !address || !id || tokenId < 0 || Number.isNaN(tokenId)) {
    return res.status(400).send('Bad Request')
  }

  /** Validate Deployment */
  const deployment = await getAssetDeploymentByContractAddressAndChainId({ chainId, address })
  if (!deployment) {
    return res.status(404).send('Not Found')
  }

  /** Validate User If Preview Branch */
  // if (deployment.branch === AssetDeploymentBranch.PREVIEW) {
  //   // check serverside session
  //   const session = await getServerAuthSession({ req, res })
  //   if (!session) {
  //     return res.status(401).send('Unauthorized')
  //   }

  //   const repository = await validateUserIsMemberInAssetDeployment({ chainId, address, session })

  //   if (!repository) {
  //     return res.status(401).send('Unauthorized')
  //   }
  // }

  if (!deployment.contractDeployment) {
    return res.status(404).send('Not Found')
  }

  if (deployment.totalSupply <= tokenId) {
    return res.status(400).send('Bad Request')
  }

  const totalSupply = await getTotalSupply(address, chainId)
  if (totalSupply.failed) {
    return res.status(500).send('Internal Server Error')
  }

  const supply = totalSupply.getValue().toNumber()
  if (supply === 0 || supply <= tokenId) {
    return res.status(400).send('Bad Request')
  }

  const { contractDeployment, repository, layerElements } = deployment
  const { width, height } = repository

  /** Check if already exists in GCP */
  const url = await getImageUrlFromGcp({ contractDeployment, deployment, tokenId })
  if (url.ok) {
    return res.redirect(url.getValue())
  }

  /** Grab tokens */
  const response = await getImageTokenFromAssetDeployment({
    deployment,
    contractDeployment,
    layerElements: layerElements as Prisma.JsonValue as v.Layer[],
    tokenId,
  })
  if (!response) {
    return res.status(500).send('Internal Server Error')
  }

  /** Create Buffer */
  const { tokens } = response
  const buf = await createTokenImageBuffer({
    width,
    height,
    tokens,
    deployment,
  })

  if (buf.failed) {
    return res.status(500).send('Internal Server Error')
  }

  /** Save Image to GCP */
  const buffer = buf.getValue()
  const saved = await saveImageToGcp({ contractDeployment, deployment, tokenId, buf: buffer })
  if (!saved.failed) {
    //! @todo log this... also, should try to minimize the number of times the saving fails, so just in case, we have this.
    return res.status(200).setHeader('Content-Type', 'image/png').send(buf.getValue())
  }

  const url2 = await getImageUrlFromGcp({ contractDeployment, deployment, tokenId })
  if (url2.failed) {
    return res.status(500).send('Internal Server Error')
  }

  /** Return buffer */
  return res.redirect(url2.getValue())
}

export default index
