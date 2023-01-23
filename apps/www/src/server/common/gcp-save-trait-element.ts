import type { DownloadResponse } from '@google-cloud/storage'
import { getLayerDeploymentBucket } from '../utils/gcp-storage'
import { Result } from '../utils/response-result'

type GetTraitElementImageReturn = Result<Buffer | null>

export const getTraitElementImageFromGCP = ({
  r,
  l,
  d,
  t,
}: {
  r: string
  d: string
  l: string
  t: string
}): Promise<GetTraitElementImageReturn> => {
  return new Promise<Result<Buffer>>(async (resolve, reject) => {
    getLayerDeploymentBucket()
      .file(`${r}/deployments/${d}/layers/${l}/${t}.png`)
      .download()
      .then((contents: DownloadResponse) => {
        if (contents[0]) resolve(Result.ok(Buffer.from(contents[0])))
        reject(Result.fail('No image found'))
      })
      .catch((err) => {
        return reject(Result.fail(err))
      })
  })
}
