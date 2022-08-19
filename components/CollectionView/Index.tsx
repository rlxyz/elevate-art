import CollectionGenerateView from '@components/CollectionView/CollectionGenerateView'
import CollectionImagesView from '@components/CollectionView/CollectionImagesView'
import CollectionRulesView from '@components/CollectionView/CollectionRulesView'
import CollectionTraitRulesView from '@components/CollectionView/CollectionTraitRulesView'
import { Button } from '@components/UI/Button'
import useCompilerViewStore from '@hooks/useCompilerViewStore'
import { useNotification } from '@hooks/useNotification'
import { fetcher } from '@utils/fetcher'
import { Repository } from '@utils/types'
import { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import LayerFolderSelector from './LayerFolderSelector'
import { CollectionViewLeftbar } from './ViewContent'
import { useHotkeys } from 'react-hotkeys-hook'
import { RefreshIcon } from '@heroicons/react/outline'

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
    fetcher
  )
  const [filters, setFilters] = useState(null)
  const { notifySuccess } = useNotification(repositoryName)
  const [layerInitiailised, setLayerInitiailised] = useState(false)

  const {
    layers,
    regenerate,
    currentViewSection,
    currentLayerPriority,
    setCurrentViewSection,
    setCollection,
    setCurrentLayer,
    setLayers,
    setRepository,
    setCurrentLayerPriority,
    setRegeneratePreview,
    setRegenerateCollection,
  } = useCompilerViewStore((state) => {
    return {
      layers: state.layers,
      regenerate: state.regenerate,
      currentViewSection: state.currentViewSection,
      currentLayerPriority: state.currentLayerPriority,
      currentCustomRulesViewSection: state.currentCustomRulesViewSection,
      setLayers: state.setLayers,
      setCurrentLayer: state.setCurrentLayer,
      setCollection: state.setCollection,
      setRepository: state.setRepository,
      setCurrentLayerPriority: state.setCurrentLayerPriority,
      setCurrentViewSection: state.setCurrentViewSection,
      setRegeneratePreview: state.setRegeneratePreview,
      setRegenerateCollection: state.setRegenerateCollection,
    }
  })

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

  useEffect(() => {
    data && setRepository(data)
    data.collections.length > 0 && setCollection(data.collections[0])
    data.layers.length > 0 && setLayers(data.layers)
    data.layers.length > 0 && setCurrentLayer(0)
  }, [data])

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
            { value: 'Top 10', label: 'Top 10' },
            { value: 'Middle 10', label: 'Middle 10' },
            { value: 'Bottom 10', label: 'Bottom 10' },
          ],
        },
        {
          id: 'trait',
          name: 'By Trait',
          options: layers.map((layer) => {
            return {
              value: layer.name,
              label: layer.name,
            }
          }),
        },
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
                  <aside className='p-8'>
                    <div className='space-y-2 mb-8'>
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
                    <div className='hidden lg:block'>
                      <form className='divide-y divide-lightGray space-y-8'>
                        {filters &&
                          filters.map((section, sectionIdx) => (
                            <div key={`${section.name}-${sectionIdx}`}>
                              <fieldset>
                                <legend
                                  className={`block text-xs font-normal text-darkGrey uppercase ${
                                    sectionIdx !== 0 ? 'pt-8' : ''
                                  }`}
                                >
                                  {section.name}
                                </legend>
                                <div className='pt-4 space-y-3'>
                                  {section.options.map((option, optionIdx) => (
                                    <div
                                      key={`${option.value}-${option.label}-${sectionIdx}`}
                                      className='flex items-center justify-between'
                                    >
                                      <label
                                        htmlFor={`${section.id}-${optionIdx}`}
                                        className='text-sm text-darkGrey'
                                      >
                                        {option.label}
                                      </label>
                                      <input
                                        id={`${section.id}-${optionIdx}`}
                                        name={`${section.id}[]`}
                                        defaultValue={option.value}
                                        type='checkbox'
                                        className='h-4 w-4 border-[1px] rounded-sm border-darkGrey bg-hue-light text-indigo-600 focus:ring-indigo-500'
                                      />
                                    </div>
                                  ))}
                                </div>
                              </fieldset>
                            </div>
                          ))}
                      </form>
                    </div>
                  </aside>
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
