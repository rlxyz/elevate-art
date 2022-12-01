import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import { LayerElement, TraitElement } from '@prisma/client'
import clsx from 'clsx'
import { Field, Form, Formik } from 'formik'
import { useState } from 'react'
import { truncate } from 'src/client/utils/format'
import useRepositoryStore from 'src/hooks/store/useRepositoryStore'
import { useQueryCollectionFindAll } from 'src/hooks/trpc/collection/useQueryCollectionFindAll'
import { useQueryLayerElementFindAll } from 'src/hooks/trpc/layerElement/useQueryLayerElementFindAll'

export const FilterByTrait = () => {
  const [layerDropdown, setLayerDropdown] = useState<null | number>(null)
  const { traitMapping, traitFilters, setTraitFilters, setTraitFilteredTokens, tokenRanking, rarityFilter, setTokens } = useRepositoryStore(
    (state) => {
      return {
        setTraitFilters: state.setTraitFilters,
        setTraitFilteredTokens: state.setTraitFilteredTokens,
        tokenRanking: state.tokenRanking,
        traitFilters: state.traitFilters,
        rarityFilter: state.rarityFilter,
        setTokens: state.setTokens,
        traitMapping: state.traitMapping,
      }
    }
  )
  const { all: layers } = useQueryLayerElementFindAll()
  const { current: collection } = useQueryCollectionFindAll()

  return (
    <Formik
      initialValues={{ checked: traitFilters.map((t) => `${t.layer.id}/${t.trait.id}`) }}
      onSubmit={async ({ checked }: { checked: string[] }) => {
        if (!collection || !layers) return
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
          setTokens(filteredRarity.map((x) => x.index))
          setTraitFilteredTokens([])
          setTraitFilters([])
          return
        }
        const filters: { layer: LayerElement; trait: TraitElement }[] = []
        checked.forEach((value: string) => {
          const layer = layers.filter((layer: LayerElement) => layer.id === value.split('/')[0])[0]
          const trait = layer?.traitElements.filter((trait: TraitElement) => trait.id === value.split('/')[1])[0]
          if (layer && trait) filters.push({ layer, trait })
        })
        setTraitFilters(filters)
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
        const allFilteredByRank = allTokenIdsArray
          .reduce(
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
          .map((val) => {
            return {
              tokenId: val,
              rank: tokenRanking.findIndex((token) => token.index === val),
            }
          })
          .sort((a, b) => a.rank - b.rank)
        const filteredRarity = allFilteredByRank.slice(
          rarityFilter === 'Top 10'
            ? 0
            : rarityFilter === 'Middle 10'
            ? parseInt((allFilteredByRank.length / 2 - 5).toFixed(0))
            : rarityFilter === 'Bottom 10'
            ? allFilteredByRank.length - 10
            : 0,
          rarityFilter === 'Top 10'
            ? 10
            : rarityFilter === 'Middle 10'
            ? parseInt((allFilteredByRank.length / 2 + 5).toFixed(0))
            : rarityFilter === 'Bottom 10'
            ? allFilteredByRank.length
            : collection.totalSupply
        )
        setTraitFilteredTokens(allFilteredByRank.map((x) => x.tokenId))
        setTokens(filteredRarity.map((x) => x.tokenId))
      }}
    >
      {({ handleChange, submitForm }) => (
        <Form>
          <div className='rounded-[5px] max-h-[70vh] overflow-y-scroll no-scrollbar'>
            {layers?.map((layer: LayerElement & { traitElements: TraitElement[] }, optionIdx: number) => (
              <div key={layer.id} className={clsx('flex flex-col text-xs', layer.traitElements.length === 0 && 'cursor-not-allowed')}>
                <div
                  onClick={(e) => {
                    e.preventDefault()
                    if (layer.traitElements.length === 0) return
                    if (layerDropdown === optionIdx) {
                      setLayerDropdown(null)
                    } else {
                      setLayerDropdown(optionIdx)
                    }
                  }}
                  className={`hover:bg-accents_8 text-xs py-3 ${layerDropdown === optionIdx ? 'font-semibold' : ''}`}
                >
                  <div className='px-3 flex justify-between'>
                    <label>{truncate(layer.name)}</label>
                    <div className='flex items-center space-x-2'>
                      <span className='text-xs'>{layer.traitElements.length}</span>
                      {layerDropdown !== optionIdx ? <ChevronDownIcon className='w-3 h-3' /> : <ChevronUpIcon className='w-3 h-3' />}
                    </div>
                  </div>
                </div>
                <div
                  className={
<<<<<<<< HEAD:apps/www/src/components/Collection/CollectionPreviewFilters.tsx
                    layerDropdown === optionIdx
                      ? 'max-h-[17.5rem] overflow-y-scroll no-scrollbar border-b border-border'
                      : 'hidden'
========
                    layerDropdown === optionIdx ? 'max-h-[17.5rem] overflow-y-scroll no-scrollbar border-b border-mediumGrey' : 'hidden'
>>>>>>>> staging:apps/www/src/client/components/collection/CollectionPreviewFilters.tsx
                  }
                >
                  {layer.traitElements
                    .sort((a, b) => a.weight - b.weight)
                    .map((traitElement: TraitElement) => {
                      return (
<<<<<<<< HEAD:apps/www/src/components/Collection/CollectionPreviewFilters.tsx
                        <div key={index}>
                          <div
                            key={traitElement.id}
                            className='flex flex-row justify-between items-center py-3 px-3 hover:bg-accents_8 w-full'
                          >
                            <span>{truncate(traitElement.name)}</span>
                            <div className='flex items-center space-x-2'>
                              <span className='text-accents_5 text-xs'>
                                {traitMapping.traitMap.size > 0 && (traitMapping?.traitMap.get(traitElement.id) || 0)}
                              </span>
                              <Field
                                type='checkbox'
                                name='checked'
                                value={`${layer.id}/${traitElement.id}`}
                                className='h-4 w-4 border rounded-[3px] border-border bg-hue-light'
                                onChange={(e: any) => {
                                  handleChange(e)
                                  submitForm()
                                }}
                              />
                            </div>
========
                        <div
                          className='flex flex-row justify-between items-center py-3 px-3 hover:bg-lightGray w-full'
                          key={traitElement.id}
                        >
                          <span>{truncate(traitElement.name)}</span>
                          <div className='flex items-center space-x-2'>
                            <span className='text-darkGrey text-xs'>
                              {traitMapping.traitMap.size > 0 && (traitMapping?.traitMap.get(traitElement.id) || 0)}
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
>>>>>>>> staging:apps/www/src/client/components/collection/CollectionPreviewFilters.tsx
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>
        </Form>
      )}
    </Formik>
  )
}

export const FilterByRarity = () => {
  const { tokenRanking, traitFilteredTokens, rarityFilter, setRarityFilter, setTokens } = useRepositoryStore((state) => {
    return {
      traitFilteredTokens: state.traitFilteredTokens,
      setRarityFilter: state.setRarityFilter,
      rarityFilter: state.rarityFilter,
      tokenRanking: state.tokenRanking,
      setTokens: state.setTokens,
    }
  })

  const filters: { value: 'Top 10' | 'Middle 10' | 'Bottom 10' | 'All' }[] = [
    { value: 'All' },
    { value: 'Top 10' },
    { value: 'Middle 10' },
    { value: 'Bottom 10' },
  ]

  return (
    <Formik
      initialValues={{ checked: rarityFilter ? rarityFilter : 'All' }}
      onSubmit={async ({ checked }: { checked: string }) => {
        const filter = filters.filter((val) => val.value === checked)[0]
        if (!filter) return
        setRarityFilter(filter.value)
        if (!traitFilteredTokens.length) {
          setTokens(
            tokenRanking
              .map((x) => x.index)
              .slice(
                filter.value === 'Top 10'
                  ? 0
                  : filter.value === 'Middle 10'
                  ? parseInt((tokenRanking.length / 2 - 5).toFixed(0))
                  : filter.value === 'Bottom 10'
                  ? tokenRanking.length - 10
                  : 0,
                filter.value === 'Top 10'
                  ? 10
                  : filter.value === 'Middle 10'
                  ? parseInt((tokenRanking.length / 2 + 5).toFixed(0))
                  : filter.value === 'Bottom 10'
                  ? tokenRanking.length
                  : tokenRanking.length
              )
          )
        } else {
          setTokens(
            traitFilteredTokens.slice(
              filter.value === 'Top 10'
                ? 0
                : filter.value === 'Middle 10'
                ? parseInt((traitFilteredTokens.length / 2 - 5).toFixed(0))
                : filter.value === 'Bottom 10'
                ? traitFilteredTokens.length - 10
                : 0,
              filter.value === 'Top 10'
                ? 10
                : filter.value === 'Middle 10'
                ? parseInt((traitFilteredTokens.length / 2 + 5).toFixed(0))
                : filter.value === 'Bottom 10'
                ? traitFilteredTokens.length
                : traitFilteredTokens.length
            )
          )
        }
      }}
    >
      {({ handleChange, submitForm }) => (
        <Form>
          <div className={clsx('rounded-[5px] max-h-[calc(100vh-17.5rem)] overflow-y-scroll no-scrollbar')}>
            {filters.map(({ value }, optionIdx: number) => (
              <div key={optionIdx} className='flex flex-col text-xs'>
                <div className={`hover:bg-accents_8 text-xs py-3`}>
                  <div className='px-3 flex justify-between'>
                    <label>{value}</label>
                    <div className='flex items-center space-x-2'>
                      <span className='text-xs'>
                        <Field
                          type='radio'
                          name='checked'
                          value={value}
                          className='h-4 w-4 border rounded-[3px] border-border bg-hue-light'
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
        </Form>
      )}
    </Formik>
  )
}

const Index = () => {
  const { all: layers } = useQueryLayerElementFindAll()
  const { current: collection } = useQueryCollectionFindAll()
  const isLoading = !layers?.length || !collection
  return (
    <>
      <div
        className={clsx(
          isLoading ? 'animate-pulse rounded-[5px] bg-accents_7 bg-opacity-50 h-full' : 'border border-border',
          'rounded-[5px] space-y-1'
        )}
      >
        <div className={clsx(isLoading && 'invisible')}>
          <FilterByRarity />
        </div>
      </div>
      <div
        className={clsx(
          isLoading ? 'animate-pulse rounded-[5px] bg-accents_7 bg-opacity-50 h-[32rem]' : 'border border-border',
          'rounded-[5px] space-y-1'
        )}
      >
        <div className={clsx(isLoading && 'invisible')}>
          <FilterByTrait />
        </div>
      </div>
    </>
  )
}

export default Index
