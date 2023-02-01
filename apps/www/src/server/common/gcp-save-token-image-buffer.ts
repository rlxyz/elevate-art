import type { AssetDeployment, ContractDeployment } from '@prisma/client'
import { getTokenDeploymentBucket } from '@server/utils/gcp-storage'
import { Result } from '@server/utils/response-result'

export const saveImageToGcp = async ({
  contractDeployment,
  deployment,
  tokenId,
  buf,
}: {
  contractDeployment: ContractDeployment
  deployment: AssetDeployment
  tokenId: number
  buf: Buffer
}): Promise<Result<boolean>> => {
  try {
    const _ = getTokenDeploymentBucket({
      branch: deployment.branch,
    })
      .file(`deployments/${contractDeployment.chainId}/${contractDeployment.address}/tokens/${tokenId}/image.png`)
      .save(buf, {
        resumable: false,
        validation: 'crc32c',
      })
    return Result.ok(true)
  } catch (err) {
    if (err instanceof Error) {
      return Result.fail('Something went wrong when saving to GCP' + err.message)
    }

    return Result.fail('Unknown Error when saving image to GCP')
  }
}
