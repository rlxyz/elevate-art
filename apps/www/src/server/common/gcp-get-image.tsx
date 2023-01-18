import type { DownloadResponse } from '@google-cloud/storage'
import type { AssetDeploymentBranch } from '@prisma/client'
import { getAssetDeploymentBucket } from '@server/utils/gcp-storage'
import { Result } from '@server/utils/response-result'

type GetTraitElementImageReturn = Result<Buffer | null>

export const getTraitElementImageFromGCP = ({
  r,
  l,
  d,
  t,
  branch,
}: {
  r: string
  d: string
  l: string
  t: string
  branch: AssetDeploymentBranch
}): Promise<GetTraitElementImageReturn> => {
  return new Promise(async (resolve, reject) => {
    getAssetDeploymentBucket({
      branch,
    })
      .file(`${r}/deployments/${d}/layers/${l}/${t}.png`)
      .download()
      .then((contents: DownloadResponse) => {
        if (contents[0]) resolve(Result.ok(contents[0]))
        reject(Result.fail('No image found'))
      })
      .catch((err) => {
        return reject(Result.fail(err))
      })
  })
}
