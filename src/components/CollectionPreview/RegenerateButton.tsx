import { Button } from '@components/UI/Button'
import { RefreshIcon } from '@heroicons/react/outline'
import { useNotification } from '@hooks/useNotification'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { createManyTokens } from '@utils/compiler'
import { trpc } from '@utils/trpc'

export const RegegenerateButton = () => {
  const { setTokens, collection, layers } = useRepositoryStore((state) => {
    return {
      layers: state.layers,
      collection: state.collection,
      setTokens: state.setTokens,
    }
  })
  const { notifySuccess } = useNotification()

  const mutation = trpc.useMutation('collection.incrementGeneration', {
    onSuccess: (data) => {
      //  update the collection
      const { totalSupply } = data
      setTokens(Array.from(Array(totalSupply).keys()))
      notifySuccess('Collection regenerated')
    },
  })

  return (
    <Button disabled={mutation.isLoading} onClick={() => mutation.mutate({ id: collection.id })}>
      <span className='p-2 flex items-center justify-center space-x-1'>
        <RefreshIcon className='w-5 h-5' />
        <span>Generate</span>
      </span>
    </Button>
  )
}
