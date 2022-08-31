import { Button } from '@components/UI/Button'
import { RefreshIcon } from '@heroicons/react/outline'
import { useNotification } from '@hooks/useNotification'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { createManyTokens } from '@utils/compiler'
import { trpc } from '@utils/trpc'
import Image from 'next/image'
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
    <div className='flex items-center border border-mediumGrey rounded-[5px] px-4 py-3'>
      <div className='space-y-4'>
        <span className='font-normal flex flex-col text-xs space-y-3'>
          <div className='flex items-center justify-between'>
            <span className='font-semibold'>Generate</span>
          </div>
          <span className='text-darkGrey'>
            You can regenerate your collection by clicking this button.
          </span>
          <Button
            disabled={mutation.isLoading}
            onClick={() => mutation.mutate({ id: collection.id })}
          >
            <span className='flex items-center justify-center space-x-2'>
              <Image priority width={30} height={30} src='/images/logo-white.png' alt='Logo' />
              <span className='text-xs'>elevate.art</span>
            </span>
          </Button>
        </span>
      </div>
    </div>
  )
}
