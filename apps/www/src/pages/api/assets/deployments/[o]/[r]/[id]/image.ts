import type { Prisma } from '@prisma/client'
import { getAssetDeploymentByProduction } from '@server/common/get-asset-deployment'
import { getImageTokenFromAssetDeployment } from '@server/common/get-compiler-token-from-deployment'
import { getImageUrlFromGcp } from '@server/common/get-image-url-from-gcp'
import { createTokenImageBuffer } from '@server/common/get-token-image-buffer'
import { saveImageToGcp } from '@server/common/save-image-to-gcp'
import type { NextApiRequest, NextApiResponse } from 'next'
import type * as v from 'src/shared/compiler'

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  /** Inputs */
  const { o: organisationName, r: repositoryName, id } = req.query as { o: string; r: string; id: string }
  if (!organisationName || !repositoryName || !id) {
    return res.status(400).send('Bad Request')
  }

  /** Validate Deployment */
  const deployment = await getAssetDeploymentByProduction({ organisationName, repositoryName })
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
  const tokenId = parseInt(id)

  /** Check if already exists in GCP */
  const url = await getImageUrlFromGcp({ deployment, tokenId })
  if (url) {
    return res.redirect(url)
  }

  /** Grab tokens */
  const response = await getImageTokenFromAssetDeployment({
    deployment,
    contractDeployment,
    layerElements: layerElements as Prisma.JsonValue as v.Layer[],
    tokenId: parseInt(id),
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
  if (!url2) {
    return res.status(500).send('Internal Server Error')
  }

  /** Return buffer */
  return res.redirect(url2)
}

export default index
