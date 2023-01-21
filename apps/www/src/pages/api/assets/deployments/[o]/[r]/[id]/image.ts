import type { Prisma } from '@prisma/client'
import { getAssetDeploymentByProduction } from '@server/common/get-asset-deployment'
import { getImageTokenFromAssetDeployment } from '@server/common/get-compiler-token-from-deployment'
import { createTokenImageBuffer } from '@server/common/get-token-image-buffer'
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

  /** Grab tokens */
  const { contractDeployment, repository, layerElements } = deployment
  const { width, height } = repository
  const tokens = await getImageTokenFromAssetDeployment({
    deployment,
    contractDeployment,
    layerElements: layerElements as Prisma.JsonValue as v.Layer[],
    tokenId: parseInt(id),
  })
  if (!tokens) return res.status(500).send('Internal Server Error')

  /** Create Buffer */
  const buf = await createTokenImageBuffer({
    width,
    height,
    tokens,
    deployment,
  })
  if (!buf) return res.status(500).send('Internal Server Error')

  /** Return buffer */
  return res.setHeader('Content-Type', 'image/png').send(buf)
}

export default index
