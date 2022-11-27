import { Collection } from '@prisma/client'
import { trpc } from 'src/client/utils/trpc'
import * as v from 'src/shared/compiler'
import useRepositoryStore from '../../store/useRepositoryStore'
import { useQueryLayerElementFindAll } from '../layerElement/useQueryLayerElementFindAll'

export const useQueryRepositoryCollection = () => {
  const { rarityFilter, setTraitMapping, setTokens, setTokenRanking, repositoryId, collectionId, setCollectionId } = useRepositoryStore(
    (state) => {
      return {
        rarityFilter: state.rarityFilter,
        setTokens: state.setTokens,
        setTraitMapping: state.setTraitMapping,
        setTokenRanking: state.setTokenRanking,
        repositoryId: state.repositoryId,
        collectionId: state.collectionId,
        setCollectionId: state.setCollectionId,
      }
    }
  )
  const { data: collections, isLoading, isError } = trpc.collection.findAll.useQuery({ repositoryId }, { enabled: !!repositoryId })
  const { all: layers } = useQueryLayerElementFindAll()

  // update the current tokens
  const mutate = ({ collection }: { collection: Collection }) => {
    if (!layers) return

    // create tokens
    const tokens = v.many(
      v.parseLayer(
        layers.map((l) => ({
          ...l,
          traits: l.traitElements.map((t) => ({
            ...t,
            rules: [...t.rulesPrimary, ...t.rulesSecondary].map(
              ({ condition, primaryTraitElementId: left, secondaryTraitElementId: right }) => ({
                type: condition as v.RulesType,
                with: left === t.id ? right : left,
              })
            ),
          })),
        }))
      ),
      Array.from({ length: collection.totalSupply }, (_, i) => v.seed(repositoryId, collection.name, collection.generations, i))
    )
    const traitMap = v.occurances.traits(tokens)
    const tokenIdMap = v.occurances.tokens(tokens)
    const rarity = v.rarity(tokens)

    setTraitMapping({
      traitMap,
      tokenIdMap,
    })
    setTokenRanking(rarity)

    setTokens(
      rarity
        .map((x) => x.index)
        .slice(
          rarityFilter === 'Top 10'
            ? 0
            : rarityFilter === 'Middle 10'
            ? parseInt((rarity.length / 2 - 5).toFixed(0))
            : rarityFilter === 'Bottom 10'
            ? rarity.length - 10
            : 0,
          rarityFilter === 'Top 10'
            ? 10
            : rarityFilter === 'Middle 10'
            ? parseInt((rarity.length / 2 + 5).toFixed(0))
            : rarityFilter === 'Bottom 10'
            ? rarity.length
            : rarity.length
        )
    )
    setCollectionId(collection.id)
  }

  return {
    current: collections?.find((c) => c.id === collectionId),
    all: collections,
    isLoading,
    isError,
    mutate,
  }
}
