import { trpc } from '@utils/trpc'
import useRepositoryStore from '../store/useRepositoryStore'

export const useQueryCollection = () => {
  const collectionId = useRepositoryStore((state) => state.collectionId)
  return trpc.useQuery(['collection.getCollectionById', { id: collectionId }])
}
