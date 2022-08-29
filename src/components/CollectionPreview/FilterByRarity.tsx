import { useEffect, useState } from 'react'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { Button } from '@components/UI/Button'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import { Field, Form, Formik } from 'formik'
import { useArtCollectionStore } from '@hooks/useArtCollectionStore'
import { LayerElement, TraitElement } from '@prisma/client'

export const FilterByRarity = () => {
  // const [filters, setFilters] = useState<any>(null) // todo: fix
  const [layerDropdown, setLayerDropdown] = useState<null | number>(null)
  const { layers, traitMapping, traitFilters, setTraitFilters } = useRepositoryStore((state) => {
    return {
      traitMapping: state.traitMapping,
      layers: state.layers,
      traitFilters: state.traitFilters,
      setTraitFilters: state.setTraitFilters,
    }
  })

  return (
    <Formik
      initialValues={{ checked: [] }}
      onSubmit={async ({ checked }: { checked: string[] }) => {
        const filters: { layer: LayerElement; trait: TraitElement }[] = checked.map(
          (value: string) => {
            const layer = layers.filter((layer) => layer.id === value.split('/')[0])[0]
            const trait = layer?.traitElements.filter(
              (trait) => trait.id === value.split('/')[1]
            )[0]
            return {
              layer,
              trait,
            }
          }
        )
        const filteredTokenIds = filters
          .map(({ layer: { id: l }, trait: { id: t } }) => traitMapping.tokenIdMap.get(l)?.get(t))
          .flatMap((map) => map)
        filteredTokenIds.sort()
      }}
    >
      {({ values, setFieldValue, handleChange, submitForm }) => (
        <Form>
          {layers.length &&
            traitMapping.tokenIdMap.size > 0 &&
            traitMapping.traitMap.size > 0 &&
            [{ name: 'Trait', id: 'something' }].map((section: any, sectionIdx: number) => (
              <div key={`${section.name}-${sectionIdx}`}>
                <fieldset className='space-y-2'>
                  <legend
                    className={`block text-xs font-normal text-darkGrey uppercase ${
                      sectionIdx !== 0 ? 'pt-8' : ''
                    }`}
                  >
                    {section.name}
                  </legend>
                  <div className='p-2 space-y-3 border border-lightGray rounded-[5px] max-h-[22em] overflow-y-scroll no-scrollbar'>
                    {layers.map(
                      (
                        layer: LayerElement & { traitElements: TraitElement[] },
                        optionIdx: number
                      ) => (
                        <div key={layer.id} className='flex flex-col'>
                          <div
                            className={`flex justify-between ${
                              layerDropdown === optionIdx
                                ? 'text-black font-semibold'
                                : 'text-darkGrey'
                            }`}
                          >
                            <label
                              htmlFor={`${section.id}-${optionIdx}`}
                              className={`text-sm ${
                                layerDropdown === optionIdx ? 'text-black font-semibold' : ''
                              }`}
                            >
                              {layer.name}
                            </label>
                            <div className='flex items-center space-x-2'>
                              <span className='text-xs'>
                                {traitMapping.traitMap?.get(layer.id)?.size || 0}
                              </span>
                              <Button
                                onClick={() => {
                                  if (layerDropdown === optionIdx) {
                                    setLayerDropdown(null)
                                  } else {
                                    setLayerDropdown(optionIdx)
                                  }
                                }}
                                className='w-5 h-5 flex justify-center items-center'
                              >
                                {layerDropdown !== optionIdx ? (
                                  <ChevronDownIcon className='w-4 h-4' />
                                ) : (
                                  <ChevronUpIcon className='w-4 h-4' />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div
                            className={
                              layerDropdown === optionIdx
                                ? 'h-[13rem] overflow-y-scroll no-scrollbar border-b border-lightGray rounded-[5px] mt-3 space-y-3 pl-1'
                                : 'hidden'
                            }
                          >
                            {layer.traitElements.map((traitElement: TraitElement) => {
                              return (
                                <div
                                  key={traitElement.id}
                                  className='flex justify-between items-center text-sm'
                                >
                                  <span className='text-darkGrey'>{traitElement.name}</span>
                                  <div className='flex items-center space-x-2'>
                                    <span className='text-darkGrey text-xs'>
                                      {traitMapping.traitMap?.get(layer.id)?.get(traitElement.id) ||
                                        0}
                                    </span>
                                    <Field
                                      type='checkbox'
                                      name='checked'
                                      value={`${layer.id}/${traitElement.id}`}
                                      className='h-5 w-5 border rounded-[5px] border-lightGray bg-hue-light'
                                      onChange={(e: any) => {
                                        handleChange(e)
                                        submitForm()
                                      }}
                                    />
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </fieldset>
              </div>
            ))}
        </Form>
      )}
    </Formik>
  )
}
