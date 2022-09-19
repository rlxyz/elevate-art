import useCollectionNavigationStore from '@hooks/useCollectionNavigationStore'
import { useDeepCompareEffect } from '@hooks/useDeepCompareEffect'
import { useQueryCollection, useQueryRepositoryLayer } from '@hooks/useRepositoryFeatures'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { createManyTokens, getTokenRanking, getTraitMappings } from '@utils/compiler'
import dynamic from 'next/dynamic'
import { CollectionNavigationEnum } from '../../types/enums'
import { FilterByRarity, FilterByTrait } from './CollectionHelpers/CollectionFilters'

const DynamicCollectionPreview = dynamic(() => import('@components/Collection/CollectionPreview/Index'), {
  ssr: false,
})
const DynamicBranchSelector = dynamic(() => import('@components/Collection/CollectionHelpers/CollectionBranchSelector'), {
  ssr: false,
})
const DynamicCollectionLayers = dynamic(() => import('@components/Collection/CollectionLayers/Index'), {
  ssr: false,
})
const DynamicLayerFolder = dynamic(() => import('@components/Collection/CollectionHelpers/LayerFolderSelector'), {
  ssr: false,
})
const DynamicRegenerateButton = dynamic(() => import('@components/Collection/CollectionHelpers/RegenerateButton'), {
  ssr: false,
})
const DynamicCollectionRules = dynamic(() => import('@components/Collection/CollectionRules/Index'), {
  ssr: false,
})

const Index = () => {
  const currentViewSection = useCollectionNavigationStore((state) => state.currentViewSection)
  const { data: collection } = useQueryCollection()
  const { data: layers } = useQueryRepositoryLayer()
  const { setTokens, tokenRanking, setTraitMapping, rarityFilter, setTokenRanking } = useRepositoryStore((state) => {
    return {
      tokenRanking: state.tokenRanking,
      rarityFilter: state.rarityFilter,
      setTokens: state.setTokens,
      setTokenRanking: state.setTokenRanking,
      setTraitMapping: state.setTraitMapping,
    }
  })
  useDeepCompareEffect(() => {
    if (!collection || !layers) return
    const tokens = createManyTokens(layers, collection.totalSupply, collection.name, collection.generations)
    const { tokenIdMap, traitMap } = getTraitMappings(tokens)
    setTraitMapping({
      tokenIdMap,
      traitMap,
    })
    const rankings = getTokenRanking(tokens, traitMap, collection.totalSupply)
    setTokenRanking(rankings)
    setTokens(
      rankings.slice(
        rarityFilter === 'Top 10'
          ? 0
          : rarityFilter === 'Middle 10'
          ? parseInt((rankings.length / 2 - 5).toFixed(0))
          : rarityFilter === 'Bottom 10'
          ? rankings.length - 10
          : 0,
        rarityFilter === 'Top 10'
          ? 10
          : rarityFilter === 'Middle 10'
          ? parseInt((rankings.length / 2 + 5).toFixed(0))
          : rarityFilter === 'Bottom 10'
          ? rankings.length
          : rankings.length
      )
    )
  }, [collection, layers])

  return (
    <div className='w-full h-full grid grid-flow-row-dense grid-cols-10 grid-rows-1'>
      <div className='col-span-2 py-8 -ml-4'>
        {[
          CollectionNavigationEnum.enum.Layers,
          CollectionNavigationEnum.enum.Rarity,
          CollectionNavigationEnum.enum.Rules,
        ].includes(currentViewSection) && (
          <div className='flex flex-col space-y-6 justify-between'>
            <DynamicLayerFolder />
          </div>
        )}
        {currentViewSection === CollectionNavigationEnum.enum.Preview && (
          <div className='relative flex flex-col space-y-3 justify-between'>
            <DynamicBranchSelector />
            <DynamicRegenerateButton />
            <div className='border border-mediumGrey rounded-[5px] p-1 space-y-1'>
              <FilterByRarity />
              <div className='px-3'>
                <div className='bg-mediumGrey h-[0.25px] w-full' />
              </div>
              <FilterByTrait />
            </div>
          </div>
        )}
      </div>
      <div className='col-span-8'>
        {currentViewSection === CollectionNavigationEnum.enum.Preview && <DynamicCollectionPreview />}
        {[CollectionNavigationEnum.enum.Layers, CollectionNavigationEnum.enum.Rarity].includes(currentViewSection) && (
          <DynamicCollectionLayers />
        )}
        {currentViewSection === CollectionNavigationEnum.enum.Rules && <DynamicCollectionRules />}
      </div>
    </div>
  )
}

export default Index
