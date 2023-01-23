import { AssetDeploymentBranch } from '@prisma/client'
import { getServerAuthSession } from '@server/common/get-server-auth-session'
import { getLayerDeploymentBucketName, getTokenDeploymentBucketName } from '@server/utils/gcp-storage'
import { parseChainId } from '@utils/ethers'
import type { NextApiRequest, NextApiResponse } from 'next'
import { log } from 'next-axiom'
import { formatBytes } from 'src/client/utils/format'
import { env } from 'src/env/server.mjs'

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res })
  log.debug(`new health check request`, { user: session?.user?.id || 'anonymous' })
  return res.status(200).send({
    nextAuthUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : env.NEXTAUTH_URL,
    apiUrl: env.NEXT_PUBLIC_API_URL,
    assetUrl: env.NEXT_PUBLIC_ASSET_URL,
    nodeEnv: env.NODE_ENV,
    nextPublicNodeEnv: env.NEXT_PUBLIC_NODE_ENV,
    maxImageBytesAllowed: formatBytes(env.NEXT_PUBLIC_IMAGE_MAX_BYTES_ALLOWED),
    bucketLayer: getLayerDeploymentBucketName(),
    bucketTokenPreview: getTokenDeploymentBucketName({ branch: AssetDeploymentBranch.PREVIEW }),
    bucketTokenProduction: getTokenDeploymentBucketName({ branch: AssetDeploymentBranch.PRODUCTION }),
    networkId: parseChainId(env.NEXT_PUBLIC_NETWORK_ID),
  })
}

export default index
