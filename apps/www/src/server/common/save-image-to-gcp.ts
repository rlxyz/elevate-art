import type { AssetDeployment } from '@prisma/client'
import { getAssetDeploymentBucket } from '@server/utils/gcp-storage'

export const saveImageToGcp = async ({ deployment, tokenId, buf }: { deployment: AssetDeployment; tokenId: number; buf: Buffer }) => {
  const _ = await getAssetDeploymentBucket({ branch: deployment.branch })
    .file(`${deployment.repositoryId}/deployments/${deployment.id}/tokens/${tokenId}/image.png`)
    .save(buf, {
      resumable: false,
      validation: 'crc32c',
    })
  return [true]
}
