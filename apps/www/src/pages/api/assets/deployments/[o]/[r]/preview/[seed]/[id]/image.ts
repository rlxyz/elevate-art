import type { Prisma } from '@prisma/client'
import { AssetDeploymentBranch } from '@prisma/client'
import { getAssetDeploymentBySeed } from '@server/common/get-asset-deployment'
import { getImageTokenFromAssetDeployment } from '@server/common/get-compiler-token-from-deployment'
import { getServerAuthSession } from '@server/common/get-server-auth-session'
import { createTokenImageBuffer } from '@server/common/get-token-image-buffer'
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
