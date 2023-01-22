import { AssetDeploymentBranch } from '@prisma/client'
import { getServerAdminSession } from '@server/common/get-server-admin-session'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getLayerDeploymentBucketName, getTokenDeploymentBucketName, storage } from 'src/server/utils/gcp-storage'

/**
 * Doesn't work if GCP service account is not set up or has bucket list permissions
 */
const index = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAdminSession({ req, res })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const [b1] = await storage.bucket(getLayerDeploymentBucketName()).exists()
  const [b2] = await storage.bucket(getTokenDeploymentBucketName({ branch: AssetDeploymentBranch.PREVIEW })).exists()
  const [b3] = await storage.bucket(getTokenDeploymentBucketName({ branch: AssetDeploymentBranch.PRODUCTION })).exists()

  return res.status(200).json({ layer: b1, tokenPreview: b2, tokenProduction: b3 })
}

export default index
