import { useNotification } from '@hooks/utils/useNotification'
import { trpc } from '@utils/trpc'
import produce from 'immer'
import { NextRouter, useRouter } from 'next/router'

export const useMutateCreateCollection = ({ onMutate }: { onMutate?: () => void }) => {
  const ctx = trpc.useContext()
  const router: NextRouter = useRouter()
  const { notifySuccess } = useNotification()
  return trpc.useMutation('collection.create', {
    // Optimistic Update
    onMutate: async (input) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await ctx.cancelQuery(['repository.getRepositoryByName', { name: input.repositoryName }])

      // Snapshot the previous value
      const backup = ctx.getQueryData(['repository.getRepositoryByName', { name: input.repositoryName }])
      if (!backup) return { backup }

      // Optimistically update to the new value
      const next = produce(backup, (draft) => {
        draft.collections = [...draft.collections, { id: input.name, name: input.name }]
      })
      ctx.setQueryData(['repository.getRepositoryByName', { name: input.repositoryName }], next)
      return { backup }
    },
    onError: (err, variables, context) => {
      if (!context?.backup) return
      ctx.setQueryData(['repository.getRepositoryByName', { name: variables.repositoryName }], context.backup)
    },
    onSettled: () => ctx.invalidateQueries(['repository.getRepositoryLayers']),
    onSuccess: (data, variables) => {
      ctx.setQueryData(['collection.getCollectionById', { id: data.id }], data)
      const backup = ctx.getQueryData(['repository.getRepositoryByName', { name: variables.repositoryName }])
      if (!backup) return
      const next = produce(backup, (draft) => {
        const index = draft.collections.findIndex((collection) => collection.id === variables.name)
        draft.collections[index] = {
          id: data.id,
          name: data.name,
        }
      })
      ctx.setQueryData(['repository.getRepositoryByName', { name: variables.repositoryName }], next)
      router.push(`/${variables.organisationName}/${variables.repositoryName}/preview?collection=${variables.name}`)
      onMutate && onMutate()
      notifySuccess(
        <span>
          <span className='text-blueHighlight'>Successfully</span>
          <span>
            created a <span className='font-semibold'>new collection!</span>
          </span>
        </span>,
        'new collection'
      )
    },
  })
}
