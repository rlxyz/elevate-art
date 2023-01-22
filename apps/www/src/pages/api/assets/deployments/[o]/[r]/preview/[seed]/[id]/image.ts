import type { Prisma } from '@prisma/client'
import { AssetDeploymentBranch } from '@prisma/client'
import { getAssetDeploymentBySeed } from '@server/common/db-get-asset-deployment-by-seed'
import { createTokenImageBuffer } from '@server/common/gcp-create-token-image-buffer'
import { getImageUrlFromGcp } from '@server/common/gcp-get-token-image-url'
import { saveImageToGcp } from '@server/common/gcp-save-token-image-buffer'
import { getServerAuthSession } from '@server/common/get-server-auth-session'
import { getImageTokenFromAssetDeployment } from '@server/common/v-create-token-hash'
import type { NextApiRequest, NextApiResponse } from 'next'
import type * as v from 'src/shared/compiler'

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  /** Authorization */
  const session = await getServerAuthSession({ req, res })
  if (!session || !session.user) {
    return res.status(401).send('Unauthorized')
  }

  /** Inputs */
  const { o: organisationName, r: repositoryName, seed, id } = req.query as { o: string; r: string; seed: string; id: string }
  const tokenId = parseInt(id)
  if (!organisationName || !repositoryName || !seed || !id) {
    return res.status(400).send('Bad Request')
  }

  /** Validate Deployment */
  const deployment = await getAssetDeploymentBySeed({ branch: AssetDeploymentBranch.PREVIEW, organisationName, repositoryName, seed })
  if (!deployment) {
    return res.status(404).send('Not Found')
  }

  if (!deployment.contractDeployment) {
    return res.status(404).send('Not Found')
  }

  if (deployment.totalSupply <= parseInt(id)) {
    return res.status(400).send('Bad Request')
  }

  const { contractDeployment, repository, layerElements } = deployment
  const { width, height } = repository

  /** Check if already exists in GCP */
  const url = await getImageUrlFromGcp({ deployment, tokenId })
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
  if (!buf) {
    return res.status(500).send('Internal Server Error')
  }

  /** Save Image to GCP */
  const [saved] = await saveImageToGcp({ deployment, tokenId, buf })
  if (!saved) {
    return res.status(500).send('Internal Server Error')
  }

  const url2 = await getImageUrlFromGcp({ deployment, tokenId })
  if (url2.failed) {
    return res.status(500).send('Internal Server Error')
  }

  /** Return buffer */
  return res.redirect(url2.getValue())
}

export default index
