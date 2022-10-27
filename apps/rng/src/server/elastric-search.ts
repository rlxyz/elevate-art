import { Client } from '@elastic/elasticsearch'
import { env } from '../env/server.mjs'

/**
 * The Elastic Search Client
 * Note: Do not use on client components as it is relatively big
 */
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

/**
 * This function finds and returns the data from Elastic Search
 * @param address the address to search to Elastic Search
 */
export const findContractData = async ({ address }: { address: string }) => {
  const elastic = await getElasticClient()
  const response = await elastic.search({
    index: 'my-index',
    body: {
      query: {
        match: {
          address,
        },
      },
    },
  })
  return response.hits.hits
}

/**
 * This function ingest (or uploads) the contract data to ElasticSearch
 * @param address the address to upload to Elastic Search
 */
export default async function ingestContractData({ address }: { address: string }) {
  const elastic = await getElasticClient()
  return await elastic.index({
    index: 'my-index',
    body: {
      address,
    },
  })
}
