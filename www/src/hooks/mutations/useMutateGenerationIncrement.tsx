import { useQueryCollection } from '@hooks/query/useQueryCollection'
import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import { getTokenRanking, getTraitMappings, renderManyToken } from '@utils/compiler'
import { trpc } from '@utils/trpc'

export const useMutateGenerationIncrement = ({ onMutate }: { onMutate?: () => void }) => {
  const { setTraitMapping, setTokenRanking } = useRepositoryStore((state) => {
    return {
      setTokenRanking: state.setTokenRanking,
      setTraitMapping: state.setTraitMapping,
    }
  })
  const { data: layers } = useQueryRepositoryLayer()
  const { data: collection } = useQueryCollection()
  const ctx = trpc.useContext()
  const { notifySuccess } = useNotification()
  return trpc.useMutation('collection.incrementGeneration', {
    // Optimistic Update
    onMutate: async (input) => {
      const backup = ctx.getQueryData(['collection.getCollectionById', { id: input.id }])
      if (!backup || !layers || !collection) return { backup }
      ctx.setQueryData(['collection.getCollectionById', { id: input.id }], {
        ...backup,
        generation: backup.generations + 1,
      })
      const tokens = renderManyToken(layers, collection)
      const { tokenIdMap, traitMap } = getTraitMappings(tokens)
      setTraitMapping({
        tokenIdMap,
        traitMap,
      })
      const rankings = getTokenRanking(tokens, traitMap, collection.totalSupply)
      setTokenRanking(rankings)
      onMutate && onMutate()
      return { backup }
    },
    onError: (err, variables, context) => {
      if (!context?.backup) return
      ctx.setQueryData(['collection.getCollectionById', { id: variables.id }], context.backup)
    },
    onSettled: () => ctx.invalidateQueries(['collection.getCollectionById']),
    onSuccess: (data, variables) => {
      notifySuccess(
        <span>
          <span className='text-blueHighlight'>Successfully</span>
          <span>
            {' '}
            generated a <span className='font-semibold'>new collection!</span>
          </span>
        </span>,
        'elevate'
      )
    },
  })
}
