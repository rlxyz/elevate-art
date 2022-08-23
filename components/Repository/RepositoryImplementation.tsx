import CollectionPreview from '@components/CollectionPreview/Index'
import CollectionLayers from '@components/ColectionLayers/Index'
import CollectionRarity from '@components/CollectionRarity/Index'
import CollectionRules from '@components/CollectionRules/Index'
import { Button } from '@components/UI/Button'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { useNotification } from '@hooks/useNotification'
import { fetcher } from '@utils/fetcher'
import { Repository } from '@utils/types'
import { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import LayerFolderSelector from '../CollectionHelpers/LayerFolderSelector'
import { CollectionViewLeftbar } from '../CollectionHelpers/ViewContent'
import { useHotkeys } from 'react-hotkeys-hook'
import { RefreshIcon } from '@heroicons/react/outline'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { createCompilerApp } from '@utils/createCompilerApp'
import { App } from '@utils/x/App'
import { ethers } from 'ethers'
import ArtCollection from '@utils/x/Collection'
import { FilterByRarity } from '@components/CollectionPreview/FilterByRarity'
import { useKeybordShortcuts } from '@hooks/useKeyboardShortcuts'

export const LayerSectionEnum = Object.freeze({
  PREVIEW: 0,
  LAYERS: 1,
  RARITY: 2,
  RULES: 3,
})

export const LayerSectionEnumNames = Object.freeze({
  0: 'preview',
  1: 'layers',
  2: 'rarity',
  3: 'rules',
})

export const LayerSectionEnumIndexes = Object.freeze({
  preview: 0,
  layers: 1,
  rarity: 2,
  rules: 3,
})

const RepositoryImplementation = () => {
  const [filters, setFilters] = useState(null)
  const {
    collection,
    layers,
    regenerate,
    currentViewSection,
    setRegenerateCollection,
  } = useRepositoryStore((state) => {
    return {
      collection: state.collection,
      artCollection: state.artCollection,
      layers: state.layers,
      regenerate: state.regenerate,
      currentViewSection: state.currentViewSection,
      currentLayerPriority: state.currentLayerPriority,
      currentCustomRulesViewSection: state.currentCustomRulesViewSection,
      setApp: state.setApp,
      setLayers: state.setLayers,
      setArtCollection: state.setArtCollection,
      setCollection: state.setCollection,
      setRepository: state.setRepository,
      setCurrentLayerPriority: state.setCurrentLayerPriority,
      setCurrentViewSection: state.setCurrentViewSection,
      setRegenerateFilter: state.setRegenerateFilter,
      setRegeneratePreview: state.setRegeneratePreview,
      setRegenerateFilterIndex: state.setRegenerateFilterIndex,
      setRegenerateCollection: state.setRegenerateCollection,
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
        // {
        //   id: 'trait',
        //   name: 'By Trait',
        //   options: layers.map((layer) => {
        //     return {
        //       value: layer.name,
        //       label: layer.name,
        //       dropdown: layer.traits.map((trait) => {
        //         return {
        //           value: trait.name,
        //           label: trait.name,
        //         }
        //       }),
        //     }
        //   }),
        // },
      ])
  }, [layers])

  return (
    <>
      <div className='min-w-screen mx-auto'>
        <div className='w-full h-full grid grid-flow-row-dense grid-cols-10 grid-rows-1'>
          <div className='col-span-2'>
            <CollectionViewLeftbar title='Art'>
              {[
                LayerSectionEnum.LAYERS,
                LayerSectionEnum.RARITY,
                LayerSectionEnum.RULES,
              ].includes(currentViewSection) && <LayerFolderSelector />}
              {currentViewSection === LayerSectionEnum.PREVIEW && (
                <div className='p-8 space-y-6 min-h-[calc(100vh-20rem)] max-h-[calc(100vh-20rem)'>
                  <div className='space-y-2'>
                    <span className='col-span-4 text-xs font-normal text-darkGrey uppercase'>
                      {'Generate'}
                    </span>
                    <div>
                      <Button
                        onClick={() => {
                          !regenerate && setRegenerateCollection(true)
                        }}
                      >
                        <span className='p-2 flex items-center justify-center space-x-1'>
                          <RefreshIcon className='w-5 h-5' />
                          <span>Generate</span>
                        </span>
                      </Button>
                    </div>
                  </div>
                  <div className='hidden lg:block overflow-hidden'>
                    <FilterByRarity />
                  </div>
                </div>
              )}
              {/* {currentViewSection === LayerSectionEnum.RULES && (
                  <aside className='p-8 divide-y divide-lightGray'>
                    <div className='mb-8 h-10'>
                      <Button
                        onClick={() => {
                          !regenerate && setRegenerateCollection(true)
                        }}
                      >
                        Generate New
                      </Button>
                    </div>
                    <div className='hidden lg:block'>
                      <form className='divide-y divide-lightGray space-y-8'>
                        <div className='mt-4'>
                          {[
                            {
                              name: 'Trait Rules',
                              icon: <CubeIcon width={20} height={20} />,
                              enumRules: CustomRulesEnum.TRAIT_RULES,
                              disabled: false,
                            },
                            {
                              name: 'Layer Order',
                              icon: <SelectorIcon width={20} height={20} />,
                              enumRules: CustomRulesEnum.LAYER_ORDERING,
                              disabled: true,
                            },
                          ].map(
                            ({ name, icon, enumRules, disabled }, index) => {
                              return (
                                <button
                                  key={`${name}-${index}`}
                                  className={`flex mt-2 flex-row w-full p-[4px] rounded-[5px] ${
                                    currentCustomRulesViewSection === enumRules
                                      ? 'bg-lightGray font-semibold'
                                      : 'text-darkGrey'
                                  }`}
                                  disabled={disabled}
                                  onClick={(e) => {
                                    e.preventDefault()
                                  }}
                                  data-tip
                                  data-for='registerTip'
                                >
                                  {icon}
                                  <span className='ml-2 text-sm'>{name}</span>
                                </button>
                              )
                            }
                          )}
                        </div>
                      </form>
                    </div>
                  </aside>
                )} */}
            </CollectionViewLeftbar>
          </div>
          <div className='col-span-8'>
            {currentViewSection === LayerSectionEnum.PREVIEW && (
              <CollectionPreview />
            )}
            {currentViewSection === LayerSectionEnum.LAYERS && (
              <CollectionLayers />
            )}
            {currentViewSection === LayerSectionEnum.RARITY && (
              <CollectionRarity />
            )}
            {currentViewSection === LayerSectionEnum.RULES && (
              <CollectionRules />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default RepositoryImplementation
