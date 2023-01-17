import { DownloadResponse } from '@google-cloud/storage'
import { storage } from '@server/utils/gcp-storage'
import { Result } from '@server/utils/response-result'

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
  return new Promise(async (resolve, reject) => {
    storage
      .bucket(`elevate-${r}-assets`)
      .file(`deployments/${d}/layers/${l}/${t}.png`)
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
