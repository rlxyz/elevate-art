import { AssetDeploymentBranch } from '@prisma/client'
import { getServerAuthSession } from '@server/common/get-server-auth-session'
import { NextApiRequest, NextApiResponse } from 'next'
import { getAssetDeploymentBucketName, storage } from 'src/server/utils/gcp-storage'

const admins = new Map<string, boolean>([
  ['0xf8cA77ED09429aDe0d5C01ADB1D284C45324F608', true],
  ['0xd2a08007eeeaf1f81eeF54Ba6A8c4Effa1e545C6', true],
])

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!prisma) return res.status(400)

  const session = await getServerAuthSession({ req, res })
  if (!session) return res.status(400)

  const address = session?.user?.address
  if (!address) return res.status(400)

  const isAdmin = admins.has(address)
  if (!isAdmin) return res.status(400)

  // create individual bucket for AssetDeploymentBranch production and preview
  const [b1] = await storage.createBucket(getAssetDeploymentBucketName({ type: AssetDeploymentBranch.PRODUCTION }), {
    location: 'US',
    storageClass: 'STANDARD',
  })
  await b1.makePublic()

  const b2 = storage.createBucket(getAssetDeploymentBucketName({ type: AssetDeploymentBranch.PRODUCTION }), {
    location: 'US',
    storageClass: 'STANDARD',
  })

  return res.status(200).json({ b1, b2 })
}

export default index
