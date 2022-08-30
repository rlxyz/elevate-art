import { useEffect, useState } from 'react'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { Button } from '@components/UI/Button'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import { Field, Form, Formik } from 'formik'
import { useArtCollectionStore } from '@hooks/useArtCollectionStore'
import { LayerElement, TraitElement } from '@prisma/client'

export const FilterByRarity = () => {
  const [layerDropdown, setLayerDropdown] = useState<null | number>(null)
  const { layers, traitMapping, setTokens, resetTokens } = useRepositoryStore((state) => {
    return {
      collection: state.collection,
      resetTokens: state.resetTokens,
      setTokens: state.setTokens,
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
        if (!checked.length) {
          resetTokens()
          return
        }
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
        const allTokenIdsArray = Object.values(
          filters
            .map(({ layer: { id: l }, trait: { id: t } }) => {
              return {
                layer: l,
                tokens: traitMapping.tokenIdMap.get(l)?.get(t) || [],
              }
            })
            .reduce((a: { [key: string]: number[] }, { layer, tokens }) => {
              a[layer] = a[layer] || []
              return { ...a, ...{ [layer]: [...(a[layer] || []), ...tokens] } }
            }, {})
        )
        const filtered = allTokenIdsArray.reduce(
          (results, item) => {
            // if (!item || !results) return results
            const tokens: number[] = item
              .map((token) => {
                if (results.includes(token)) return [token]
                return []
              })
              .flatMap((x) => x)
            return tokens
          },
          [...(allTokenIdsArray[0] || [])]
        )
        setTokens(filtered)
      }}
    >
      {({ values, setFieldValue, handleChange, submitForm }) => (
        <Form>
          {layers.length &&
            traitMapping.tokenIdMap.size > 0 &&
            traitMapping.traitMap.size > 0 &&
            [{ name: 'Traits', id: 'something' }].map((section: any, sectionIdx: number) => (
              <div key={`${section.name}-${sectionIdx}`}>
                <div className='space-y-2'>
                  <span className={`text-xs font-normal text-darkGrey uppercase`}>
                    {section.name}
                  </span>
                  <div className='rounded-[5px] max-h-[calc(100vh-17.5rem)] overflow-y-scroll no-scrollbar'>
                    {layers.map(
                      (
                        layer: LayerElement & { traitElements: TraitElement[] },
                        optionIdx: number
                      ) => (
                        <div key={layer.id} className='flex flex-col text-xs'>
                          <Button
                            onClick={() => {
                              if (layerDropdown === optionIdx) {
                                setLayerDropdown(null)
                              } else {
                                setLayerDropdown(optionIdx)
                              }
                            }}
                            className={`hover:bg-lightGray hover:bg-opacity-30 text-sm rounded-[5px] py-3 ${
                              layerDropdown === optionIdx ? 'font-semibold' : ''
                            }`}
                          >
                            <div className='px-1 flex justify-between'>
                              <label htmlFor={`${section.id}-${optionIdx}`}>{layer.name}</label>
                              <div className='flex items-center space-x-2'>
                                <span className='text-xs'>
                                  {traitMapping.traitMap?.get(layer.id)?.size || 0}
                                </span>
                                {layerDropdown !== optionIdx ? (
                                  <ChevronDownIcon className='w-3 h-3' />
                                ) : (
                                  <ChevronUpIcon className='w-3 h-3' />
                                )}
                              </div>
                            </div>
                          </Button>
                          <div
                            className={
                              layerDropdown === optionIdx
                                ? 'h-[17.5rem] overflow-y-scroll no-scrollbar border-b border-lightGray rounded-[5px] space-y-3'
                                : 'hidden'
                            }
                          >
                            {layer.traitElements.map((traitElement: TraitElement, index) => {
                              return (
                                <div key={index}>
                                  <Button
                                    key={traitElement.id}
                                    className='flex flex-row justify-between items-center py-3 px-1 hover:bg-lightGray hover:bg-opacity-20 w-full rounded-[5px]'
                                  >
                                    <span className='uppercase'>{traitElement.name}</span>
                                    <div className='flex items-center space-x-2'>
                                      <span className='text-darkGrey text-xs'>
                                        {traitMapping.traitMap
                                          ?.get(layer.id)
                                          ?.get(traitElement.id) || 0}
                                      </span>
                                      <Field
                                        type='checkbox'
                                        name='checked'
                                        value={`${layer.id}/${traitElement.id}`}
                                        className='h-4 w-4 border rounded-[3px] border-lightGray bg-hue-light'
                                        onChange={(e: any) => {
                                          handleChange(e)
                                          submitForm()
                                        }}
                                      />
                                    </div>
                                  </Button>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
        </Form>
      )}
    </Formik>
  )
}
