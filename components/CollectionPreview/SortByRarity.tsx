import { useEffect, useState } from 'react'
import useCompilerViewStore from '@hooks/useCompilerViewStore'
import { Button } from '@components/UI/Button'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import { Field, Form, Formik } from 'formik'
import { ArtCollectionElement } from '@utils/x/Collection'

const submitMyForm = ({ value }) => {
  alert(value)
}

export const SortByRarity = () => {
  const [filters, setFilters] = useState(null)
  const [layerDropdown, setLayerDropdown] = useState(null)
  const { artCollection, layers, traitFilters, setTraitFilters } =
    useCompilerViewStore((state) => {
      return {
        artCollection: state.artCollection,
        layers: state.layers,
        traitFilters: state.traitFilters,
        setTraitFilters: state.setTraitFilters,
      }
    })

  useEffect(() => {
    layers &&
      setFilters([
        // {
        //   id: 'rarity',
        //   name: 'By Rarity',
        //   options: [
        //     { value: 'Top 10', label: 'Top 10', start: 0, end: 10 },
        //     {
        //       value: 'Middle 10',
        //       label: 'Middle 10',
        //       start: parseInt((collection.totalSupply / 2 - 5).toFixed(0)),
        //       end: parseInt((collection.totalSupply / 2 + 5).toFixed(0)),
        //     },
        //     {
        //       value: 'Bottom 10',
        //       label: 'Bottom 10',
        //       start: collection.totalSupply - 10,
        //       end: collection.totalSupply,
        //     },
        //   ],
        // },
        {
          id: 'trait',
          name: 'By Trait',
          options: layers.map((layer) => {
            return {
              value: layer.name,
              label: layer.name,
              dropdown: layer.traits.map((trait) => {
                return {
                  value: trait.name,
                  label: trait.name,
                }
              }),
            }
          }),
        },
      ])
  }, [layers])

  return (
    <Formik
      initialValues={{ checked: [] }}
      onSubmit={async (values) => {
        const filters: ArtCollectionElement[] = values.checked.map((value) => {
          return {
            trait_type: value.split('/')[0],
            value: value.split('/')[1],
          }
        })
        artCollection.setFilter(filters)
      }}
    >
      {({ values, setFieldValue, handleChange, submitForm }) => (
        <Form>
          {filters &&
            filters.map((section, sectionIdx) => (
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
                    {section.options.map((option, optionIdx) => (
                      <div
                        key={`${option.value}-${option.label}-${sectionIdx}`}
                        className='flex flex-col'
                      >
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
                              layerDropdown === optionIdx
                                ? 'text-black font-semibold'
                                : ''
                            }`}
                          >
                            {option.label}
                          </label>
                          {/* {sectionIdx === 0 ? (
                        <input
                          id={`${section.id}-${optionIdx}`}
                          name={`${section.id}[]`}
                          defaultValue={option.value}
                          type='checkbox'
                          className='h-5 w-5 border rounded-[5px] border-lightGray bg-hue-light'
                          onClick={() => {
                            setRegenerateFilterIndex({
                              start: option.start,
                              end: option.end,
                            })
                            setRegenerateFilter(true)
                          }}
                        />
                      ) : (
                        <Button
                          onClick={() => {
                            if (layerDropdown === optionIdx) {
                              setLayerDropdown(null)
                            } else {
                              setLayerDropdown(optionIdx)
                            }
                          }}
                          className='border rounded-[5px] border-lightGray'
                        >
                          <ChevronDownIcon className='w-5 h-5 text-darkGrey' />
                        </Button>
                      )} */}
                          <div className='flex items-center space-x-2'>
                            <span className='text-xs'>
                              {
                                Object.keys(
                                  artCollection.attributeMap[option.value]
                                ).length
                              }
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
                          {option.dropdown.map((d, index) => {
                            return (
                              <div
                                key={index}
                                className='flex justify-between items-center text-sm'
                              >
                                <span className='text-darkGrey'>{d.label}</span>
                                <div className='flex items-center space-x-2'>
                                  <span className='text-darkGrey text-xs'>
                                    {artCollection.getTraitCount({
                                      trait_type: option.value,
                                      value: d.value,
                                    })}
                                  </span>
                                  <Field
                                    type='checkbox'
                                    name='checked'
                                    value={`${option.label}/${d.value}`}
                                    className='h-5 w-5 border rounded-[5px] border-lightGray bg-hue-light'
                                    onChange={(e) => {
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
                    ))}
                  </div>
                </fieldset>
              </div>
            ))}
        </Form>
      )}
    </Formik>
  )
}
