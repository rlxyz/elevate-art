import { Result } from '@server/utils/response-result'
import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: 'https://global-noted-narwhal-30117.upstash.io',
  token: 'AXWlASQgNTE1MzVkMDYtNTY4My00NzI1LTk0NjgtODRiZjUzZjQ5ZWYzZmVhN2QwNmM0ZWMxNDNmYmE4YTBlYTA2MjAxY2U2N2Y=',
})

export const get = async <T>(key: string): Promise<Result<T> | null> => {
  return new Promise(async (resolve, reject) => {
    redis
      .get(key)
      .then((response) => {
        if (!response) return reject(Result.fail('not found')) // @todo fix this; better error handling
        return resolve(Result.ok(JSON.parse(response)))
      })
      .catch((error) => {
        return reject(Result.fail(error))
      })
  })
}

export const set = async <T>(key: string, fetchData: () => Promise<Result<T>>): Promise<Result<T>> => {
  return new Promise(async (resolve, reject) => {
    fetchData()
      .then(async (response) => {
        if (response.failed) return reject(response.error)
        const data = response.getValue()
        await redis.set(key, `test`)
        return resolve(Result.ok(data))
      })
      .catch((error) => {
        return reject(Result.fail(error))
      })
  })
}

export const fetch = async <T>(key: string, fetchData: () => Promise<Result<T>>) => {
  const cachedData = await get(key)
  if (cachedData) return cachedData
  return set(key, fetchData)
}
