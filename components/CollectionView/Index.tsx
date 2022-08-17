import CollectionGenerateView from '@components/CollectionView/CollectionGenerateView'
import CollectionImagesView from '@components/CollectionView/CollectionImagesView'
import CollectionTraitRulesView from '@components/CollectionView/CollectionTraitRulesView'
import CollectionRulesView from '@components/CollectionView/CollectionRulesView'
import { Button } from '@components/UI/Button'
import useCompilerViewStore from '@hooks/useCompilerViewStore'
import { useNotification } from '@hooks/useNotification'
import { fetcher } from '@utils/fetcher'
import { Repository } from '@utils/types'
import { NextRouter, useRouter } from 'next/router'
import { useEffect } from 'react'
import useSWR from 'swr'
import ReactTooltip from 'react-tooltip'
import LayerFolderSelector from './LayerFolderSelector'
import { CollectionViewLeftbar } from './ViewContent'
import { CubeIcon, SelectorIcon } from '@heroicons/react/outline'

export enum LayerSectionEnum {
  PREVIEW = 0,
  IMAGES = 1,
  RARITY = 2,
  RULES = 3,
}

export enum CustomRulesEnum {
  TRAIT_RULES = 0,
  LAYER_ORDERING = 1,
}

const filters = [
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
    options: [
      { value: 'Background', label: 'Background' },
      { value: 'Scenery', label: 'Scenery' },
      { value: 'Clamps', label: 'Clamps' },
      { value: 'Accessories', label: 'Accessories' },
      { value: 'Arms', label: 'Arms' },
      { value: 'Gloves', label: 'Gloves' },
      { value: 'Shoulder', label: 'Shoulder' },
      { value: 'Body', label: 'Body' },
      { value: 'Body Accessories', label: 'Body Accessories' },
      { value: 'Head Detail', label: 'Head Detail' },
      { value: 'Mouth', label: 'Mouth' },
      { value: 'Eyes', label: 'Eyes' },
      { value: 'Head Accessories', label: 'Head Accessories' },
    ],
  },
]

const DomView = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const { data } = useSWR<Repository>(
    [organisationName, repositoryName],
    fetcher
  )
  const { notifySuccess } = useNotification(repositoryName)

  const {
    layers,
    regenerate,
    currentViewSection,
    currentLayerPriority,
    currentCustomRulesViewSection,
    setCollection,
    setCurrentLayer,
    setLayers,
    setRepository,
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
      setRegenerateCollection: state.setRegenerateCollection,
    }
  })

  useEffect(() => {
    data && setRepository(data)
    data.collections.length > 0 && setCollection(data.collections[0])
    data.layers.length > 0 && setLayers(data.layers)
    data.layers.length > 0 && setCurrentLayer(0)
  }, [data])

  return (
    layers &&
    layers.length > 0 && (
      <>
        <div className='min-w-screen mx-auto'>
          <div className='w-full h-full grid grid-flow-row-dense grid-cols-10 grid-rows-1'>
            <div className='col-span-2'>
              <CollectionViewLeftbar title='Art'>
                {[LayerSectionEnum.IMAGES, LayerSectionEnum.RARITY].includes(
                  currentViewSection
                ) && <LayerFolderSelector />}
                {currentViewSection === LayerSectionEnum.PREVIEW && (
                  <aside className='p-8'>
                    <div className='mb-8 h-10'>
                      <Button
                        onClick={() => {
                          !regenerate && setRegenerateCollection(true)
                          notifySuccess()
                        }}
                      >
                        Generate New
                      </Button>
                    </div>
                    <div className='hidden lg:block'>
                      <form className='divide-y divide-lightGray space-y-8'>
                        {filters.map((section, sectionIdx) => (
                          <div key={`${section.name}-${sectionIdx}`}>
                            <fieldset>
                              <legend
                                className={`block text-xs font-semibold text-darkGrey uppercase ${
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
                {currentViewSection === LayerSectionEnum.RULES && (
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
                )}
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
