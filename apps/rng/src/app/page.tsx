import { getElasticClient } from '../server/elastric-search'
import MainSearch from './main-search'

export default async function Home() {
  const elastic = await getElasticClient()
  const response = await elastic.info()
  console.log(response.cluster_uuid)
  return (
    <div className='min-h-[calc(100vh-7rem)] flex flex-col items-center justify-center'>
      <MainSearch />
    </div>
  )
}
