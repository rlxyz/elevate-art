import type { Prisma } from '@prisma/client'
import { getAssetDeploymentByContractAddressAndChainId } from '@server/common/db-get-asset-deployment-by-production-branch'
import { getTotalSupply } from '@server/common/ethers-get-contract-total-supply'
import { getImageTokenFromAssetDeployment } from '@server/common/v-create-token-hash'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getBannerForRepository, getLogoForRepository, getTokenURILegacy } from 'src/client/utils/image'
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
  /** Grab tokens */
  const { contractDeployment, layerElements } = deployment
  const elements = layerElements as Prisma.JsonValue as v.Layer[]
  const response = await getImageTokenFromAssetDeployment({
    deployment,
    contractDeployment,
    layerElements: elements,
    tokenId,
  })

  if (!response) return res.status(500).send('Internal Server Error')

  const { tokens, vseed } = response
  const metadata = {
    name: [deployment.repository.tokenName || '', `#${tokenId}`].join(' '),
    description: deployment.repository.description,
    tokenHash: vseed.startsWith('0x') ? vseed : null,
    image: getTokenURILegacy({ contractDeployment: deployment.contractDeployment, tokenId }),
    attributes: tokens.map(([l, t]) => {
      const layerElement = elements.find((x) => x.id === l)
      if (!layerElement) return
      const traitElement = layerElement.traits.find((x) => x.id === t)
      if (!traitElement) return
      return { trait_type: layerElement.name, value: traitElement.name }
    }),
    logoImage: getBannerForRepository({ r: deployment.repository.id }),
    bannerImage: getLogoForRepository({ r: deployment.repository.id }),
    artist: deployment.repository.artist,
    license: deployment.repository.license,
    external_url: deployment.repository.externalUrl,
  }

  return res
    .setHeader('Content-Type', 'application/json')
    .send(JSON.stringify(Object.fromEntries(Object.entries(metadata).filter(([_, v]) => v != null)), null, 2))
}

export default index
