import CollectionLayers from '@components/Collection/ColectionLayers/Index'
import { FilterByRarity, FilterByTrait } from '@components/Collection/CollectionPreview/FilterByTrait'
import CollectionPreview from '@components/Collection/CollectionPreview/Index'
import { RegegenerateButton } from '@components/Collection/CollectionPreview/RegenerateButton'
import CollectionRarity from '@components/Collection/CollectionRarity/Index'
import CollectionRules from '@components/Collection/CollectionRules/Index'
import CollectionSettings from '@components/Collection/CollectionSettings/Index'
import { SettingsNavigations } from '@components/Collection/CollectionSettings/SettingsNavigations'
import useRepositoryRouterStore from '@hooks/useRepositoryRouterStore'
import { LayerSectionEnum } from '../../types/enums'
import LayerFolderSelector from './CollectionHelpers/LayerFolderSelector'

const Index = () => {
  const { currentViewSection } = useRepositoryRouterStore((state) => {
    return {
      currentViewSection: state.currentViewSection,
    }
  })

  return (
    <div className='w-full h-full grid grid-flow-row-dense grid-cols-10 grid-rows-1'>
      <div className='col-span-2 py-8 -ml-4'>
        {[LayerSectionEnum.enum.Layers, LayerSectionEnum.enum.Rarity, LayerSectionEnum.enum.Rules].includes(
          currentViewSection
        ) && (
          <div className='flex flex-col space-y-6 justify-between'>
            <LayerFolderSelector />
          </div>
        )}
        {currentViewSection === LayerSectionEnum.enum.Preview && (
          <div className='flex flex-col space-y-6 justify-between'>
            <RegegenerateButton />
            <FilterByRarity />
            <FilterByTrait />
          </div>
        )}
        {currentViewSection === LayerSectionEnum.enum.Settings && (
          <div className='flex flex-col space-y-6 justify-between'>
            <SettingsNavigations />
          </div>
        )}
      </div>
      <div className='col-span-8'>
        {currentViewSection === LayerSectionEnum.enum.Preview && <CollectionPreview />}
        {currentViewSection === LayerSectionEnum.enum.Layers && <CollectionLayers />}
        {currentViewSection === LayerSectionEnum.enum.Rarity && <CollectionRarity />}
        {currentViewSection === LayerSectionEnum.enum.Rules && <CollectionRules />}
        {currentViewSection === LayerSectionEnum.enum.Settings && <CollectionSettings />}
      </div>
    </div>
  )
}

export default Index
