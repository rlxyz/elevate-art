import { Button } from '@components/UI/Button'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { LayerElement, TraitElement } from '@prisma/client'
import { trpc } from '@utils/trpc'
import { Field, Form, Formik } from 'formik'
import { useState } from 'react'

export const FilterByTrait = () => {
  const [layerDropdown, setLayerDropdown] = useState<null | number>(null)
  const { traitMapping, tokenRanking, rarityFilter, collectionId, repositoryId, setTokens } = useRepositoryStore(
    (state) => {
      return {
        tokenRanking: state.tokenRanking,
        rarityFilter: state.rarityFilter,
        repositoryId: state.repositoryId,
        collectionId: state.collectionId,
        setTokens: state.setTokens,
        traitMapping: state.traitMapping,
        traitFilters: state.traitFilters,
        setTraitFilters: state.setTraitFilters,
      }
    }
  )
  const { data: layers } = trpc.useQuery(['repository.getRepositoryLayers', { id: repositoryId }])
  const { data: collection } = trpc.useQuery(['collection.getCollectionById', { id: collectionId }])

  if (!collection || !layers) return null

  return (
    <Formik
      initialValues={{ checked: [] }}
      onSubmit={async ({ checked }: { checked: string[] }) => {
        if (!checked.length) {
          const filteredRarity = tokenRanking.slice(
            rarityFilter === 'Top 10'
              ? 0
              : rarityFilter === 'Middle 10'
              ? parseInt((tokenRanking.length / 2 - 5).toFixed(0))
              : rarityFilter === 'Bottom 10'
              ? tokenRanking.length - 10
              : 0,
            rarityFilter === 'Top 10'
              ? 10
              : rarityFilter === 'Middle 10'
              ? parseInt((tokenRanking.length / 2 + 5).toFixed(0))
              : rarityFilter === 'Bottom 10'
              ? tokenRanking.length
              : collection.totalSupply
          )
          setTokens(filteredRarity)
          return
        }
        const filters: { layer: LayerElement; trait: TraitElement }[] = []
        checked.forEach((value: string) => {
          const layer = layers.filter((layer) => layer.id === value.split('/')[0])[0]
          const trait = layer?.traitElements.filter((trait) => trait.id === value.split('/')[1])[0]
          if (layer && trait) filters.push({ layer, trait })
        })
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

        const filteredRarity = filtered
          .map((val) => {
            return {
              tokenId: val,
              rank: tokenRanking.findIndex((token) => token === val),
            }
          })
          .sort((a, b) => a.rank - b.rank)
          .slice(
            rarityFilter === 'Top 10'
              ? 0
              : rarityFilter === 'Middle 10'
              ? parseInt((filtered.length / 2 - 5).toFixed(0))
              : rarityFilter === 'Bottom 10'
              ? filtered.length - 10
              : 0,
            rarityFilter === 'Top 10'
              ? 10
              : rarityFilter === 'Middle 10'
              ? parseInt((filtered.length / 2 + 5).toFixed(0))
              : rarityFilter === 'Bottom 10'
              ? filtered.length
              : collection.totalSupply
          )
          .map((x) => x.tokenId)
        setTokens(filteredRarity)
      }}
    >
      {({ handleChange, submitForm }) => (
        <Form>
          {layers.length &&
            traitMapping.tokenIdMap.size > 0 &&
            traitMapping.traitMap.size > 0 &&
            [{ name: 'Traits', id: 'something' }].map((section: any, sectionIdx: number) => (
              <div className='space-y-2' key={`${section.name}-${sectionIdx}`}>
                {/* <span className={`text-xs font-normal text-darkGrey uppercase`}>
                    {section.name}
                  </span> */}
                <div className='rounded-[5px] max-h-[calc(100vh-17.5rem)] overflow-y-scroll no-scrollbar'>
                  {layers.map((layer: LayerElement & { traitElements: TraitElement[] }, optionIdx: number) => (
                    <div key={layer.id} className='flex flex-col text-xs'>
                      <Button
                        onClick={() => {
                          if (layerDropdown === optionIdx) {
                            setLayerDropdown(null)
                          } else {
                            setLayerDropdown(optionIdx)
                          }
                        }}
                        className={`hover:bg-mediumGrey hover:bg-opacity-50 text-xs rounded-[5px] py-3 ${
                          layerDropdown === optionIdx ? 'font-semibold' : ''
                        }`}
                      >
                        <div className='pr-1 pl-5 flex justify-between'>
                          <label htmlFor={`${section.id}-${optionIdx}`}>{layer.name}</label>
                          <div className='flex items-center space-x-2'>
                            <span className='text-xs'>{traitMapping.traitMap?.get(layer.id)?.size || 0}</span>
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
                            ? 'h-[17.5rem] overflow-y-scroll no-scrollbar border-b border-mediumGrey rounded-[5px] space-y-3'
                            : 'hidden'
                        }
                      >
                        {layer.traitElements.map((traitElement: TraitElement, index) => {
                          return (
                            <div key={index}>
                              <Button
                                key={traitElement.id}
                                className='flex flex-row justify-between items-center py-3 pr-1 pl-5 hover:bg-mediumGrey hover:bg-opacity-30 w-full rounded-[5px]'
                              >
                                <span>{traitElement.name}</span>
                                <div className='flex items-center space-x-2'>
                                  <span className='text-darkGrey text-xs'>
                                    {traitMapping.traitMap?.get(layer.id)?.get(traitElement.id) || 0}
                                  </span>
                                  <Field
                                    type='checkbox'
                                    name='checked'
                                    value={`${layer.id}/${traitElement.id}`}
                                    className='h-4 w-4 border rounded-[3px] border-mediumGrey bg-hue-light'
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
                  ))}
                </div>
              </div>
            ))}
        </Form>
      )}
    </Formik>
  )
}

export const FilterByRarity = () => {
  const { traitMapping, tokenRanking, rarityFilter, setRarityFilter, collectionId, setTokens } = useRepositoryStore(
    (state) => {
      return {
        rarityFilter: state.rarityFilter,
        setRarityFilter: state.setRarityFilter,
        tokenRanking: state.tokenRanking,
        collectionId: state.collectionId,
        setTokens: state.setTokens,
        traitMapping: state.traitMapping,
        traitFilters: state.traitFilters,
        setTraitFilters: state.setTraitFilters,
      }
    }
  )
  const { data: collectionData } = trpc.useQuery(['collection.getCollectionById', { id: collectionId }])
  const filters: { value: 'Top 10' | 'Middle 10' | 'Bottom 10' | 'All' }[] = [
    { value: 'All' },
    { value: 'Top 10' },
    { value: 'Middle 10' },
    { value: 'Bottom 10' },
  ]

  if (!collectionData) return null

  return (
    <Formik
      initialValues={{ checked: 'All' }}
      onSubmit={async ({ checked }: { checked: string }) => {
        if (!checked) {
          // resetTokens(collectionData.totalSupply)
          return
        }
        const filter = filters.filter((val) => val.value === checked)[0]
        if (!filter) return
        setRarityFilter(filter.value)
        setTokens(
          tokenRanking.slice(
            filter.value === 'Top 10'
              ? 0
              : filter.value === 'Middle 10'
              ? parseInt((collectionData.totalSupply / 2 - 5).toFixed(0))
              : filter.value === 'Bottom 10'
              ? collectionData.totalSupply - 10
              : 0,
            filter.value === 'Top 10'
              ? 10
              : filter.value === 'Middle 10'
              ? parseInt((collectionData.totalSupply / 2 + 5).toFixed(0))
              : filter.value === 'Bottom 10'
              ? collectionData.totalSupply
              : collectionData.totalSupply
          )
        )
      }}
    >
      {({ handleChange, submitForm }) => (
        <Form>
          {traitMapping.tokenIdMap.size > 0 &&
            traitMapping.traitMap.size > 0 &&
            [{ name: 'Rarity', id: 'rarity' }].map((section: any, sectionIdx: number) => (
              <div className='space-y-2' key={`${section.name}-${sectionIdx}`}>
                <div className='rounded-[5px] max-h-[calc(100vh-17.5rem)] overflow-y-scroll no-scrollbar'>
                  {filters.map(({ value }, optionIdx: number) => (
                    <div key={optionIdx} className='flex flex-col text-xs'>
                      <div className={`hover:bg-mediumGrey hover:bg-opacity-50 text-xs rounded-[5px] py-3`}>
                        <div className='pr-1 pl-5 flex justify-between'>
                          <label htmlFor={`${section.id}-${optionIdx}`}>{value}</label>
                          <div className='flex items-center space-x-2'>
                            <span className='text-xs'>
                              <Field
                                type='radio'
                                name='checked'
                                value={value}
                                className='h-4 w-4 border rounded-[3px] border-mediumGrey bg-hue-light'
                                onChange={(e: any) => {
                                  handleChange(e)
                                  submitForm()
                                }}
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </Form>
      )}
    </Formik>
  )
}
