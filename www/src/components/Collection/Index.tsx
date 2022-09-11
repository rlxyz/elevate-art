import useCollectionNavigationStore from '@hooks/useCollectionNavigationStore'
import dynamic from 'next/dynamic'
import { CollectionNavigationEnum } from '../../types/enums'

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
const DynamicCollectionFilters = dynamic(() => import('@components/Collection/CollectionHelpers/CollectionFilters'), {
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
          <div className='flex flex-col space-y-6 justify-between'>
            <DynamicRegenerateButton />
            <DynamicCollectionFilters />
          </div>
        )}
        {/* {currentViewSection === CollectionNavigationEnum.enum.Settings && (
          <div className='flex flex-col space-y-6 justify-between'>
            <SettingsNavigations />
          </div>
        )} */}
      </div>
      <div className='col-span-8'>
        {currentViewSection === CollectionNavigationEnum.enum.Preview && <DynamicCollectionPreview />}
        {currentViewSection === CollectionNavigationEnum.enum.Layers && <DynamicCollectionLayers />}
        {/* {currentViewSection === CollectionNavigationEnum.enum.Rarity && <CollectionRarity />} */}
        {/* {currentViewSection === CollectionNavigationEnum.enum.Rules && <CollectionRules />} */}
        {/* {currentViewSection === CollectionNavigationEnum.enum.Settings && <CollectionSettings />} */}
      </div>
    </div>
  )
}

export default Index
