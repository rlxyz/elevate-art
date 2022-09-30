import { trpc } from '@utils/trpc'
import useRepositoryStore from '../store/useRepositoryStore'

export const useQueryRepositoryLayer = () => {
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  return trpc.useQuery(['repository.getRepositoryLayers', { id: repositoryId }])
}
