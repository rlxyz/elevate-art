import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import useCollectionNavigationStore from '@hooks/store/useCollectionNavigationStore'
import { useState } from 'react'
import LayerGridView from './RepositoryRarityLayer'
import LayerRarityTable from './RepositoryRarityTable'

const Index = () => {
  const currentLayerPriority = useCollectionNavigationStore((state) => state.currentLayerPriority)
  const { all: layers, current: layer, isLoading } = useQueryRepositoryLayer()
  const [query, setQuery] = useState('')
  const [currentView, setCurrentView] = useState<'rarity' | 'layers'>('rarity')
  const [isOpen, setIsOpen] = useState(false)
  if (!layer) return null
  const filteredTraitElements = layer.traitElements.filter((x) => x.name.toLowerCase().includes(query.toLowerCase()))
  return (
    <>
      {currentView === 'layers' && (
        <>
          {/* <input
            placeholder='Search...'
            onChange={(e) => setQuery(e.target.value)}
            className='py-2 border text-sm h-full w-full border-mediumGrey rounded-[5px] flex items-center pl-4 text-darkGrey'
          /> */}
          <LayerGridView traitElements={filteredTraitElements} layerName={layer?.name} />
        </>
      )}
      {currentView === 'rarity' && <LayerRarityTable />}
    </>
  )
}

export default Index
