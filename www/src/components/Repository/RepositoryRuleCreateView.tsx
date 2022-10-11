import { Combobox } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { useMutateRepositoryCreateRule } from '@hooks/mutations/useMutateRepositoryCreateRule'
import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useCloudinaryHelper } from '@hooks/utils/useCloudinaryHelper'
import { useDeepCompareEffect } from '@hooks/utils/useDeepCompareEffect'
import { LayerElement, Rules, TraitElement } from '@prisma/client'
import { classNames } from '@utils/format'
import clsx from 'clsx'
import Image from 'next/image'
import { Dispatch, SetStateAction, useState } from 'react'
import { clientEnv } from 'src/env/schema.mjs'
import { RulesEnum, RulesType } from 'src/types/enums'
import { ComboboxInput } from './RepositoryRuleCombobox'

export const RuleSelector = ({
  layers,
}: {
  layers: (LayerElement & {
    traitElements: (TraitElement & {
      rulesPrimary: (Rules & {
        primaryTraitElement: TraitElement
        secondaryTraitElement: TraitElement
      })[]
      rulesSecondary: (Rules & {
        primaryTraitElement: TraitElement
        secondaryTraitElement: TraitElement
      })[]
    })[]
  })[]
}) => {
  const [selectedCondition, setSelectedCondition] = useState<null | RulesType>(null)
  const [selectedLeftTrait, setSelectedLeftTrait] = useState<
    | null
    | (TraitElement & {
        rulesPrimary: (Rules & {
          primaryTraitElement: TraitElement
          secondaryTraitElement: TraitElement
        })[]
        rulesSecondary: (Rules & {
          primaryTraitElement: TraitElement
          secondaryTraitElement: TraitElement
        })[]
      })
  >(null)
  const [selectedRightTrait, setSelectedRightTrait] = useState<
    | null
    | (TraitElement & {
        rulesPrimary: (Rules & {
          primaryTraitElement: TraitElement
          secondaryTraitElement: TraitElement
        })[]
        rulesSecondary: (Rules & {
          primaryTraitElement: TraitElement
          secondaryTraitElement: TraitElement
        })[]
      })
  >(null)
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { mutate, isLoading } = useMutateRepositoryCreateRule()

  // note: this will transform all rules in the selected trait to a standard format and return the trait ids that are already selected
  const allInvalidRightTraitElements = [...(selectedLeftTrait?.rulesPrimary || []), ...(selectedLeftTrait?.rulesSecondary || [])]
    .map((rule) => {
      if (selectedLeftTrait?.id === rule.primaryTraitElementId) {
        return {
          condition: rule.condition,
          from: rule.primaryTraitElementId,
          with: rule.secondaryTraitElementId,
        }
      } else {
        return {
          condition: rule.condition,
          from: rule.secondaryTraitElementId,
          with: rule.primaryTraitElementId,
        }
      }
    })
    .filter((rule) => {
      if (!selectedCondition) return true
      return rule.condition === selectedCondition
    })
    .map((rule) => rule.with)

  const allRightTraitElements = layers
    .filter((layer) => !selectedLeftTrait || (selectedLeftTrait && layer.id !== selectedLeftTrait.layerElementId))
    .flatMap((layer) => layer.traitElements)
    .filter((trait) => {
      if (!selectedLeftTrait) return true
      return !allInvalidRightTraitElements.includes(trait.id)
    })

  return (
    <div className='w-full flex flex-col space-y-3'>
      <div className='grid grid-cols-10 space-x-3'>
        <div className='col-span-3 relative mt-1'>
          <RuleSelectorCombobox
            traitElements={layers.flatMap((layer) => layer.traitElements)}
            selected={selectedLeftTrait}
            onChange={setSelectedLeftTrait}
          />
        </div>
        <div className='col-span-2 relative mt-1'>
          <RuleSelectorConditionCombobox selected={selectedCondition} onChange={setSelectedCondition} />
        </div>
        <div className='col-span-4 relative mt-1'>
          <RuleSelectorCombobox
            traitElements={allRightTraitElements}
            selected={selectedRightTrait}
            onChange={setSelectedRightTrait}
          />
        </div>
        <div className='col-span-1 relative mt-1 flex items-center right-0 justify-center'>
          <button
            className='bg-black disabled:bg-disabledGray disabled:cursor-not-allowed disabled:text-white w-full h-full rounded-[5px] text-white text-xs'
            disabled={!(selectedCondition && selectedLeftTrait && selectedRightTrait) || isLoading}
            onClick={() => {
              if (!(selectedCondition && selectedLeftTrait && selectedRightTrait)) return
              mutate(
                {
                  condition: selectedCondition,
                  primaryTraitElementId: selectedLeftTrait.id,
                  primaryLayerElementId: selectedLeftTrait.layerElementId,
                  secondaryTraitElementId: selectedRightTrait.id,
                  secondaryLayerElementId: selectedRightTrait.layerElementId,
                },
                {
                  onSuccess: () => {
                    setSelectedLeftTrait(null)
                    setSelectedRightTrait(null)
                    setSelectedCondition(null)
                  },
                }
              )
            }}
          >
            Add Rule
          </button>
        </div>
      </div>
    </div>
  )
}

export const RuleSelectorConditionCombobox = ({
  selected,
  onChange,
}: {
  selected: 'cannot mix with' | 'must mix with' | null
  onChange: Dispatch<SetStateAction<'cannot mix with' | 'must mix with' | null>>
}) => {
  const [query, setQuery] = useState('')
  const filteredConditions: RulesType[] =
    query === ''
      ? [RulesEnum.enum['cannot mix with'] as RulesType, RulesEnum.enum['must mix with'] as RulesType]
      : [RulesEnum.enum['cannot mix with'] as RulesType, RulesEnum.enum['must mix with'] as RulesType].filter((conditions) => {
          return conditions.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <Combobox as='div' value={selected} onChange={onChange}>
      <Combobox.Input
        className={clsx(
          'w-full rounded-[5px] border border-mediumGrey bg-hue-light py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm',
          selected && 'border-blueHighlight'
        )}
        onChange={(event) => setQuery(event.target.value)}
        displayValue={(value: RulesType) => value}
        placeholder={RulesEnum.enum['cannot mix with']}
      />
      <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
        <SelectorIcon className='h-3 w-3 text-darkGrey' aria-hidden='true' />
      </Combobox.Button>
      <Combobox.Options className='absolute z-10 mt-1 max-h-60 min-w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
        {filteredConditions.map((condition: RulesType, index: number) => (
          <Combobox.Option
            key={condition}
            value={condition}
            className={({ active }) =>
              classNames('relative cursor-default select-none py-2 pl-3 pr-9', active ? 'text-blueHighlight' : 'text-black')
            }
          >
            {({ active, selected }) => (
              <>
                <span className={classNames('block truncate', selected ? 'font-semibold' : '')}>{condition}</span>
                {selected && (
                  <span
                    className={classNames(
                      'absolute inset-y-0 right-0 flex items-center pr-4',
                      active ? 'text-black' : 'text-indigo-600'
                    )}
                  >
                    <CheckIcon className='h-5 w-5' aria-hidden='true' />
                  </span>
                )}
              </>
            )}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  )
}

export const RuleSelectorCombobox = ({
  traitElements,
  selected,
  onChange,
}: {
  traitElements: TraitElement[]
  selected:
    | null
    | (TraitElement & {
        rulesPrimary: (Rules & {
          primaryTraitElement: TraitElement
          secondaryTraitElement: TraitElement
        })[]
        rulesSecondary: (Rules & {
          primaryTraitElement: TraitElement
          secondaryTraitElement: TraitElement
        })[]
      })
  onChange: Dispatch<
    SetStateAction<
      | (TraitElement & {
          rulesPrimary: (Rules & {
            primaryTraitElement: TraitElement
            secondaryTraitElement: TraitElement
          })[]
          rulesSecondary: (Rules & {
            primaryTraitElement: TraitElement
            secondaryTraitElement: TraitElement
          })[]
        })
      | null
    >
  >
}) => {
  const [query, setQuery] = useState('')
  const { all: layers } = useQueryRepositoryLayer()
  const { cld } = useCloudinaryHelper()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const filteredTraits =
    query === ''
      ? traitElements
      : traitElements.filter((traitElement) => {
          return traitElement.name.toLowerCase().includes(query.toLowerCase())
        })
  useDeepCompareEffect(() => onChange(null), [traitElements])
  if (!layers) return null
  return (
    <Combobox as='div' value={selected} onChange={onChange}>
      <Combobox.Input
        as={ComboboxInput}
        onChange={(event) => setQuery(event.target.value)}
        displayValue={(traitElement: TraitElement) => traitElement?.name}
        placeholder='Search a trait...'
        traitElement={selected}
        layerName={layers.find((layer) => layer.id === selected?.layerElementId)?.name || ''}
      />
      <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
        <SelectorIcon className='h-3 w-3 text-darkGrey' aria-hidden='true' />
      </Combobox.Button>
      {filteredTraits.length > 0 && (
        <Combobox.Options className='absolute z-10 mt-1 max-h-60 min-w-full max-w-[calc(100% + 5rem)] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
          {filteredTraits.map((traitElement) => (
            <Combobox.Option
              key={traitElement.id}
              value={traitElement}
              className={({ active }) =>
                classNames('relative cursor-default select-none py-2 pl-3 pr-9', active ? 'text-blueHighlight' : 'text-darkGrey')
              }
            >
              {({ active, selected }) => (
                <>
                  <div className='flex flex-row items-center space-x-3'>
                    <div className='relative h-[35px] w-[35px]'>
                      <div className='absolute w-full h-full border border-mediumGrey rounded-[5px]'>
                        <Image
                          src={cld
                            .image(
                              `${clientEnv.NEXT_PUBLIC_NODE_ENV}/${repositoryId}/${traitElement.layerElementId}/${traitElement.id}`
                            )
                            .toURL()}
                          layout='fill'
                          className='rounded-[3px]'
                        />
                      </div>
                    </div>
                    <div className='flex flex-row space-x-2 items-center'>
                      <span className={classNames('block truncate text-xs tracking-tight', selected ? 'font-semibold' : '')}>
                        {layers.filter((layer) => layer.id === traitElement.layerElementId)[0]?.name}
                      </span>
                      <span className={classNames('block truncate', selected ? 'font-semibold' : '')}>{traitElement.name}</span>
                    </div>
                  </div>
                  {selected && (
                    <span
                      className={classNames(
                        'absolute inset-y-0 right-0 flex items-center pr-4',
                        active ? 'text-white' : 'text-indigo-600'
                      )}
                    >
                      <CheckIcon className='h-5 w-5' aria-hidden='true' />
                    </span>
                  )}
                </>
              )}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      )}
    </Combobox>
  )
}
