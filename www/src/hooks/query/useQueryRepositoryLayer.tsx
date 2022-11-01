import { trpc } from '@utils/trpc'
import { useRouter } from 'next/router'
import useRepositoryStore from '../store/useRepositoryStore'

export const useQueryRepositoryLayer = () => {
  const router = useRouter()
  const layerName = router.query.layer
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { data: layers, isLoading, isError } = trpc.useQuery(['layers.getAll', { id: repositoryId }])

  return {
    current: (layerName && layers?.find((l) => l.name === layerName)) || (layers && layers[0]),
    all: layers,
    isLoading,
    isError,
  }
}
