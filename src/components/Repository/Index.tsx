import CollectionPreview from '@components/CollectionPreview/Index'
import CollectionLayers from '@components/ColectionLayers/Index'
import CollectionRarity from '@components/CollectionRarity/Index'
import CollectionRules from '@components/CollectionRules/Index'
import { Button } from '@components/UI/Button'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { useNotification } from '@hooks/useNotification'
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
import useRepositoryRouterStore from '@hooks/useRepositoryRouterStore'
import { LayerSectionEnum } from '../../types/enums'
import { RegegenerateButton } from '@components/CollectionPreview/RegenerateButton'

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
                LayerSectionEnum.enum.Layers,
                LayerSectionEnum.enum.Rarity,
                LayerSectionEnum.enum.Rules,
              ].includes(currentViewSection) && <LayerFolderSelector />}
              {currentViewSection === LayerSectionEnum.enum.Preview && (
                <div className='p-8 space-y-6 min-h-[calc(100vh-20rem)] max-h-[calc(100vh-20rem)'>
                  <div className='space-y-2'>
                    <span className='col-span-4 text-xs font-normal text-darkGrey uppercase'>
                      {'Generate'}
                    </span>
                    <RegegenerateButton />
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
            {currentViewSection === LayerSectionEnum.enum.Preview && <CollectionPreview />}
            {currentViewSection === LayerSectionEnum.enum.Layers && <CollectionLayers />}
            {currentViewSection === LayerSectionEnum.enum.Rarity && <CollectionRarity />}
            {currentViewSection === LayerSectionEnum.enum.Rules && <CollectionRules />}
          </div>
        </div>
      </div>
    </>
  )
}

export default Index
