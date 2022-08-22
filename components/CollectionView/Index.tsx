import CollectionGenerateView from '@components/CollectionPreview/Index'
import CollectionImagesView from '@components/ColectionLayers/Index'
import CollectionRulesView from '@components/CollectionRarity/Index'
import CollectionTraitRulesView from '@components/CollectionRules/Index'
import { Button } from '@components/UI/Button'
import useCompilerViewStore from '@hooks/useCompilerViewStore'
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
import { SortByRarity } from '@components/CollectionPreview/SortByRarity'

export enum LayerSectionEnum {
  PREVIEW = 0,
  IMAGES = 1,
  RARITY = 2,
  RULES = 3,
}

const DomView = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const { data } = useSWR<Repository>(
    [organisationName, repositoryName],
    fetcher,
    {
      refreshInterval: 300,
    }
  )
  const [filters, setFilters] = useState(null)
  const [layerInitiailised, setLayerInitiailised] = useState(false)

  const {
    collection,
    layers,
    regenerate,
    currentViewSection,
    currentLayerPriority,
    artCollection,
    setApp,
    setRegenerateFilter,
    setCurrentViewSection,
    setCollection,
    setArtCollection,
    setCurrentLayer,
    setLayers,
    setRepository,
    setCurrentLayerPriority,
    setRegeneratePreview,
    setRegenerateCollection,
    setRegenerateFilterIndex,
  } = useCompilerViewStore((state) => {
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
      setCurrentLayer: state.setCurrentLayer,
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

  useHotkeys(
    'shift+1',
    () => layerInitiailised && layers.length > 0 && setCurrentLayerPriority(0)
  )
  useHotkeys(
    'shift+2',
    () => layerInitiailised && layers.length > 1 && setCurrentLayerPriority(1)
  )
  useHotkeys(
    'shift+3',
    () => layerInitiailised && layers.length > 3 && setCurrentLayerPriority(2)
  )
  useHotkeys(
    'shift+4',
    () => layerInitiailised && layers.length > 4 && setCurrentLayerPriority(3)
  )
  useHotkeys(
    'shift+5',
    () => layerInitiailised && layers.length > 5 && setCurrentLayerPriority(4)
  )
  useHotkeys(
    'shift+6',
    () => layerInitiailised && layers.length > 6 && setCurrentLayerPriority(5)
  )
  useHotkeys(
    'shift+7',
    () => layerInitiailised && layers.length > 7 && setCurrentLayerPriority(6)
  )
  useHotkeys(
    'shift+8',
    () => layerInitiailised && layers.length > 8 && setCurrentLayerPriority(7)
  )
  useHotkeys(
    'shift+9',
    () => layers.length > 9 && setCurrentLayerPriority(layers.length - 1)
  )
  useHotkeys(
    'shift+cmd+up',
    () =>
      layerInitiailised &&
      currentLayerPriority > 0 &&
      setCurrentLayerPriority(currentLayerPriority - 1),
    {
      keydown: true,
    },
    [currentLayerPriority, setCurrentLayerPriority]
  )
  useHotkeys(
    'shift+cmd+down',
    () =>
      layerInitiailised &&
      currentLayerPriority + 1 < layers.length &&
      setCurrentLayerPriority(currentLayerPriority + 1),
    {
      keydown: true,
    },
    [currentLayerPriority, setCurrentLayerPriority]
  )
  useHotkeys(
    'shift+cmd+right',
    () =>
      layerInitiailised &&
      currentViewSection + 1 < 4 &&
      setCurrentViewSection(currentViewSection + 1),
    {
      keydown: true,
    },
    [currentViewSection, setCurrentViewSection]
  )
  useHotkeys(
    'shift+cmd+left',
    () =>
      layerInitiailised &&
      currentViewSection > 0 &&
      setCurrentViewSection(currentViewSection - 1),
    {
      keydown: true,
    },
    [currentViewSection, setCurrentViewSection]
  )
  useHotkeys('ctrl+1', () => setCurrentViewSection(LayerSectionEnum.PREVIEW))
  useHotkeys('ctrl+2', () => setCurrentViewSection(LayerSectionEnum.IMAGES))
  useHotkeys('ctrl+3', () => setCurrentViewSection(LayerSectionEnum.RARITY))
  useHotkeys('ctrl+4', () => setCurrentViewSection(LayerSectionEnum.RULES))
  useHotkeys('ctrl+g', () => setRegenerateCollection(true))
  useHotkeys('ctrl+r', () => setRegeneratePreview(true))

  const createCollectionSeed = (collectionId: string, generation: number) => {
    return parseInt(
      ethers.utils
        .keccak256(ethers.utils.toUtf8Bytes(`${collectionId}-${generation}`))
        .toString(),
      16
    )
  }

  useEffect(() => {
    data && setRepository(data)
    data.collections.length > 0 && setCollection(data.collections[0])
    data.layers.length > 0 && setLayers(data.layers)
    data.layers.length > 0 && setCurrentLayer(0)
  }, [data])

  // useEffect(() => {
  //   console.log(artCollection)
  // }, [artCollection])

  useEffect(() => {
    setLayerInitiailised(true)
  }, [layers])

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
    layers &&
    layers.length > 0 && (
      <>
        <div className='min-w-screen mx-auto'>
          <div className='w-full h-full grid grid-flow-row-dense grid-cols-10 grid-rows-1'>
            <div className='col-span-2'>
              <CollectionViewLeftbar title='Art'>
                {[
                  LayerSectionEnum.IMAGES,
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
                      <SortByRarity />
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
              <div
                className={
                  currentViewSection !== LayerSectionEnum.IMAGES ? 'hidden' : ''
                }
              >
                <CollectionImagesView />
              </div>
              <div
                className={
                  currentViewSection !== LayerSectionEnum.RARITY ? 'hidden' : ''
                }
              >
                <CollectionRulesView />
              </div>
              <div
                className={
                  currentViewSection !== LayerSectionEnum.PREVIEW
                    ? 'hidden'
                    : ''
                }
              >
                <CollectionGenerateView />
              </div>
              <div
                className={
                  currentViewSection !== LayerSectionEnum.RULES ? 'hidden' : ''
                }
              >
                <CollectionTraitRulesView />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  )
}

export default DomView
