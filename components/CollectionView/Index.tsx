import LayerFolderSelector from './LayerFolderSelector'
import useSWR from 'swr'
import { fetcher } from '@utils/fetcher'
import useCompilerViewStore from '@hooks/useCompilerViewStore'
import GenerateView from '@components/CollectionView/CollectionGenerateView'
import RulesView from '@components/CollectionView/CollectionRulesView'
import ImagesView from '@components/CollectionView/CollectionImagesView'
import { Repository } from '@utils/types'
import { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { CollectionViewLeftbar } from './ViewContent'
import { Button } from '@components/UI/Button'
import { useNotification } from '@hooks/useNotification'

export enum LayerSectionEnum {
  IMAGES = 0,
  RULES = 1,
  GENERATE = 2,
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
    currentViewSection,
    layers,
    regenerate,
    setCollection,
    setCurrentLayer,
    setLayers,
    setRepository,
    setRegenerateCollection,
  } = useCompilerViewStore((state) => {
    return {
      currentViewSection: state.currentViewSection,
      layers: state.layers,
      regenerate: state.regenerate,
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
          {/* <main className='min-w-screen min-h-screen'> */}
          <div className='w-full h-full grid grid-flow-row-dense grid-cols-10 grid-rows-1'>
            <div className='col-span-2'>
              <CollectionViewLeftbar title='Art'>
                {[LayerSectionEnum.IMAGES, LayerSectionEnum.RULES].includes(
                  currentViewSection
                ) && <LayerFolderSelector />}
                {currentViewSection === LayerSectionEnum.GENERATE && (
                  <aside className='p-8'>
                    <div className='hidden lg:block'>
                      <form className='divide-y divide-lightGray space-y-8'>
                        <Button
                          onClick={() => {
                            !regenerate && setRegenerateCollection(true)
                            notifySuccess()
                          }}
                          fullWidth
                        >
                          Generate New
                        </Button>
                        {filters.map((section, sectionIdx) => (
                          <div key={`${section.name}-${sectionIdx}`}>
                            <fieldset>
                              <legend className='block text-xs font-semibold text-darkGrey uppercase pt-8'>
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
              </CollectionViewLeftbar>
            </div>
            <div className='col-span-8'>
              <div
                className={
                  currentViewSection !== LayerSectionEnum.IMAGES ? 'hidden' : ''
                }
              >
                <ImagesView />
              </div>
              <div
                className={
                  currentViewSection !== LayerSectionEnum.RULES ? 'hidden' : ''
                }
              >
                <RulesView />
              </div>
              <div
                className={
                  currentViewSection !== LayerSectionEnum.GENERATE
                    ? 'hidden'
                    : ''
                }
              >
                <GenerateView />
              </div>
            </div>
          </div>
          {/* </main> */}
        </div>
      </>
    )
  )
}

export default DomView
