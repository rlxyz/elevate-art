import Button from '@components/Layout/Button'
import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import useCollectionNavigationStore from '@hooks/store/useCollectionNavigationStore'
import clsx from 'clsx'
import ordinal from 'ordinal'
import { useState } from 'react'
import { RepositoryCreateTrait } from '../Actions/RepositoryCreateTrait'
import LayerGridView from './RepositoryRarityLayer'
import LayerRarityTable from './RepositoryRarityTable'

const Index = () => {
  const currentLayerPriority = useCollectionNavigationStore((state) => state.currentLayerPriority)
  const { all: layers, current: layer, isLoading } = useQueryRepositoryLayer()
  const [query, setQuery] = useState('')
  const [currentView, setCurrentView] = useState<'rarity' | 'layers'>('rarity')
  if (!layer) return null
  const filteredTraitElements = layer.traitElements.filter((x) => x.name.toLowerCase().includes(query.toLowerCase()))
  return (
    <>
      <div className='grid grid-cols-10'>
        <div className='col-span-8 flex flex-col'>
          <div className='col-span-6 font-plus-jakarta-sans'>
            <h1 className={clsx('text-2xl font-bold text-black', isLoading && 'animate-pulse')}>{layer.name}</h1>
            <p className={clsx('text-sm text-darkGrey', isLoading && 'animate-pulse')}>
              <span>
                There are {layer.traitElements.length} {layer?.name} that make up the{' '}
                <span className='text-blueHighlight'>{`${ordinal(
                  (layers?.findIndex((x) => x.id === currentLayerPriority) || 0) + 1
                )} layer`}</span>
              </span>
            </p>
          </div>
        </div>
        <div className='col-span-2 w-full flex justify-end items-end'>
          <div className='flex space-x-2'>
            <Button
              variant='secondary'
              onClick={() => setCurrentView('rarity')}
              className={clsx(currentView === 'rarity' && 'bg-mediumGrey bg-opacity-40 border-blueHighlight')}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className={clsx('w-5 h-5 p-0.5', currentView === 'rarity' ? 'text-blueHighlight' : 'text-darkGrey')}
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
              </svg>
            </Button>
            <Button
              variant='secondary'
              onClick={() => setCurrentView('layers')}
              className={clsx(currentView === 'layers' && 'bg-mediumGrey bg-opacity-40 border-blueHighlight')}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.25}
                stroke='currentColor'
                className={clsx('w-5 h-5 p-0.5', currentView === 'layers' ? 'text-blueHighlight' : 'text-darkGrey')}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z'
                />
              </svg>
            </Button>
            <RepositoryCreateTrait />
          </div>
        </div>
      </div>
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
