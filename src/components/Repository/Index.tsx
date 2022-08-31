import CollectionPreview from '@components/CollectionPreview/Index'
import CollectionLayers from '@components/ColectionLayers/Index'
import CollectionRarity from '@components/CollectionRarity/Index'
import CollectionRules from '@components/CollectionRules/Index'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { useEffect, useState } from 'react'
import LayerFolderSelector from '../CollectionHelpers/LayerFolderSelector'
import useRepositoryRouterStore from '@hooks/useRepositoryRouterStore'
import { LayerSectionEnum } from '../../types/enums'
import { FilterByRarity } from '@components/CollectionPreview/FilterByRarity'
import { RegegenerateButton } from '@components/CollectionPreview/RegenerateButton'
import CollectionSettings from '@components/CollectionSettings/Index'
import { SettingsNavigations } from '@components/CollectionSettings/SettingsNavigations'

type Filter = {
  id: string
  name: string
  options: { value: string; label: string; start: number; end: number }[]
}

const Index = () => {
  const [filters, setFilters] = useState<Filter[] | null>(null)
  const { collection, layers, regenerate, setRegenerateCollection } = useRepositoryStore(
    (state) => {
      return {
        collection: state.collection,
        layers: state.layers,
        regenerate: state.regenerate,
        setRegenerateCollection: state.setRegenerateCollection,
      }
    }
  )

  const { currentViewSection } = useRepositoryRouterStore((state) => {
    return {
      currentViewSection: state.currentViewSection,
    }
  })

  const [layerDropdown, setLayerDropdown] = useState(null)

  useEffect(() => {
    layers &&
      setFilters([
        {
          id: 'rarity',
          name: 'By Rarity',
          options: [
            { value: 'Top 10', label: 'Top 10', start: 0, end: 10 },
            {
              value: 'Middle 10',
              label: 'Middle 10',
              start: parseInt((collection.totalSupply / 2 - 5).toFixed(0)),
              end: parseInt((collection.totalSupply / 2 + 5).toFixed(0)),
            },
            {
              value: 'Bottom 10',
              label: 'Bottom 10',
              start: collection.totalSupply - 10,
              end: collection.totalSupply,
            },
          ],
        },
      ])
  }, [layers])

  return (
    <>
      <div className='w-full h-full grid grid-flow-row-dense grid-cols-10 grid-rows-1'>
        <div className='col-span-2 py-8'>
          {[
            LayerSectionEnum.enum.Layers,
            LayerSectionEnum.enum.Rarity,
            LayerSectionEnum.enum.Rules,
          ].includes(currentViewSection) && (
            <div className='flex flex-col space-y-6 justify-between'>
              <RegegenerateButton />
              <LayerFolderSelector />
            </div>
          )}
          {currentViewSection === LayerSectionEnum.enum.Preview && (
            <div className='flex flex-col space-y-6 justify-between'>
              <RegegenerateButton />
              <FilterByRarity />
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
    </>
  )
}

export default Index
