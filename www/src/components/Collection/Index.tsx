import ViewAllRepositories from '@components/Views/ViewAllCollections'
import useCollectionNavigationStore from '@hooks/useCollectionNavigationStore'
import dynamic from 'next/dynamic'
import { CollectionNavigationEnum } from '../../types/enums'
import { FilterByRarity, FilterByTrait } from './CollectionHelpers/CollectionFilters'

const DynamicCollectionPreview = dynamic(() => import('@components/Collection/CollectionPreview/Index'), {
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
const DynamicCollectionRarity = dynamic(() => import('@components/Collection/CollectionRarity/Index'), {
  ssr: false,
})
const DynamicCollectionRules = dynamic(() => import('@components/Collection/CollectionRules/Index'), {
  ssr: false,
})

const Index = () => {
  const { currentViewSection } = useCollectionNavigationStore((state) => {
    return {
      currentViewSection: state.currentViewSection,
    }
  })

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
            <ViewAllRepositories />
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
        {currentViewSection === CollectionNavigationEnum.enum.Layers && <DynamicCollectionLayers />}
        {currentViewSection === CollectionNavigationEnum.enum.Rarity && <DynamicCollectionRarity />}
        {currentViewSection === CollectionNavigationEnum.enum.Rules && <DynamicCollectionRules />}
      </div>
    </div>
  )
}

export default Index
