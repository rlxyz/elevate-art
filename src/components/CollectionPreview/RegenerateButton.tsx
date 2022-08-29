import { Button } from '@components/UI/Button'
import { RefreshIcon } from '@heroicons/react/outline'
import { useNotification } from '@hooks/useNotification'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { createManyTokens } from '@utils/compiler'
import { trpc } from '@utils/trpc'
import { useQueryClient } from 'react-query'

export const RegegenerateButton = () => {
  const { collection, layers } = useRepositoryStore((state) => {
    return {
      layers: state.layers,
      collection: state.collection,
    }
  })
  const { notifySuccess } = useNotification()
  const ctx = trpc.useContext()

  const mutation = trpc.useMutation('collection.incrementGeneration', {
    onSuccess: (data, variables) => {
      ctx.setQueryData(['collection.getCollectionById', { id: variables.id }], data)
      notifySuccess('Collection regenerated')
    },
  })

  return (
    <Button disabled={mutation.isLoading} onClick={() => mutation.mutate({ id: collection.id })}>
      <span className='py-1 flex items-center justify-center space-x-2'>
        <RefreshIcon className='w-3 h-3' />
        <span className='text-xs'>elevate.art</span>
      </span>
    </Button>
  )
}
