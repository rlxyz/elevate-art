import { Client } from '@elastic/elasticsearch'
import { env } from '../env/server.mjs'

export const getElasticClient = async () => {
  return new Client({
    cloud: {
      id: env.ESS_CLOUD_ID,
    },
    auth: {
      username: env.ESS_CLOUD_USERNAME,
      password: env.ESS_CLOUD_PASSWORD,
    },
  })
}
