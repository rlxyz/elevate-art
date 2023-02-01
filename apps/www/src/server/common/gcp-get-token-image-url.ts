import type { AssetDeployment, ContractDeployment } from '@prisma/client'
import { AssetDeploymentBranch } from '@prisma/client'
import { getTokenDeploymentBucket, getTokenDeploymentBucketName } from '@server/utils/gcp-storage'
import { Result } from '@server/utils/response-result'

export const getImageUrlFromGcp = async ({
  contractDeployment,
  deployment,
  tokenId,
}: {
  contractDeployment: ContractDeployment
  deployment: AssetDeployment
  tokenId: number
}): Promise<Result<string>> => {
  return new Promise<Result<string>>(async (resolve) => {
    try {
      const [exists] = await getTokenDeploymentBucket({ branch: deployment.branch })
        .file(`deployments/${contractDeployment.chainId}/${contractDeployment.address}/tokens/${tokenId}/image.png`)
        .exists()

      if (!exists) {
        return resolve(Result.fail('Image does not exist'))
      }

      if (deployment.branch === AssetDeploymentBranch.PREVIEW) {
        const [signedUrl] = await getTokenDeploymentBucket({ branch: deployment.branch })
          .file(`deployments/${contractDeployment.chainId}/${contractDeployment.address}/tokens/${tokenId}/image.png`)
          .getSignedUrl({
            action: 'read',
            expires: Date.now() + 15 * 60 * 1000,
          })

        return resolve(Result.ok(signedUrl))
      } else if (deployment.branch === AssetDeploymentBranch.PRODUCTION) {
        const url = `https://storage.googleapis.com/${getTokenDeploymentBucketName({
          branch: deployment.branch,
        })}/deployments/${contractDeployment.chainId}/${contractDeployment.address}/tokens/${tokenId}/image.png`
        return resolve(Result.ok(url))
      }

      return resolve(Result.fail('Could not get images url'))
    } catch (error) {
      if (error instanceof Error) {
        return resolve(Result.fail(error.message))
      }

      return resolve(Result.fail('Could not get images url'))
    }
  })
}
