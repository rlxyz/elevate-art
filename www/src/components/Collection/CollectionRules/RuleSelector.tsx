import { SmallAdvancedImage } from '@components/Collection/CollectionHelpers/AdvancedImage'
import { Combobox } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { useDeepCompareEffect } from '@hooks/useDeepCompareEffect'
import { useMutateRepositoryRule, useQueryRepositoryLayer } from '@hooks/useRepositoryFeatures'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { TraitElement } from '@prisma/client'
import { createCloudinary } from '@utils/cloudinary'
import { classNames } from '@utils/format'
import clsx from 'clsx'
import Image from 'next/image'
import { Dispatch, SetStateAction, useState } from 'react'
import { clientEnv } from 'src/env/schema.mjs'
import { RulesEnum, RulesType } from 'src/types/enums'

const RuleSelector = () => {
  const [selectedCondition, setSelectedCondition] = useState<RulesType | null | string>()
  const [selectedLeftTrait, setSelectedLeftTrait] = useState<null | TraitElement>()
  const [selectedRightTrait, setSelectedRightTrait] = useState<null | TraitElement>()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { mutate, isLoading } = useMutateRepositoryRule({
    onMutate: () => {
      setSelectedCondition(null)
      setSelectedLeftTrait(null)
      setSelectedRightTrait(null)
    },
  })
  const { data: layers } = useQueryRepositoryLayer()
  if (!layers) return null
  const allRightTraitElements = layers
    .filter((layer) => {
      if (!selectedLeftTrait) return true
      return layer.id !== selectedLeftTrait.layerElementId
    })
    .flatMap((layer) => layer.traitElements)

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
              mutate({
                repositoryId: repositoryId,
                type: selectedCondition,
                primaryTraitElementId: selectedLeftTrait.id,
                primaryLayerElementId: selectedLeftTrait.layerElementId,
                secondaryTraitElementId: selectedRightTrait.id,
                secondaryLayerElementId: selectedRightTrait.layerElementId,
              })
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
  selected: undefined | null | string
  onChange: Dispatch<SetStateAction<string | null | undefined>>
}) => {
  const [query, setQuery] = useState('')
  const filteredConditions =
    query === ''
      ? [
          { id: 0, name: RulesEnum.enum['cannot mix with'] },
          // { id: 1, name: RulesEnum.enum['only mixes with'] },
          // { id: 3, name: 'always mixes with' },
        ]
      : [
          { id: 0, name: RulesEnum.enum['cannot mix with'] },
          // { id: 1, name: RulesEnum.enum['only mixes with'] },
          // { id: 3, name: 'always mixes with' },
        ].filter((conditions) => {
          return conditions.name.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <Combobox as='div' value={selected} onChange={onChange}>
      <Combobox.Input
        className={clsx(
          'w-full rounded-[5px] border border-mediumGrey bg-hue-light py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm',
          selected && 'border-blueHighlight'
        )}
        onChange={(event) => setQuery(event.target.value)}
        displayValue={(value: string) => value}
        placeholder='cannot mix with'
      />
      <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
        <SelectorIcon className='h-3 w-3 text-darkGrey' aria-hidden='true' />
      </Combobox.Button>
      <Combobox.Options className='absolute z-10 mt-1 max-h-60 min-w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
        {filteredConditions.map((option, index) => (
          <Combobox.Option
            key={index}
            value={option.name}
            className={({ active }) =>
              classNames('relative cursor-default select-none py-2 pl-3 pr-9', active ? 'text-blueHighlight' : 'text-black')
            }
          >
            {({ active, selected }) => (
              <>
                <span className={classNames('block truncate', selected ? 'font-semibold' : '')}>{option.name}</span>
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

const ComboboxInput = ({ traitElement, layerName }: { layerName: string; traitElement: TraitElement | null | undefined }) => {
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const cld = createCloudinary()
  return (
    <div
      className={clsx(
        'flex items-center space-x-2 w-full rounded-[5px] border border-mediumGrey text-sm bg-hue-light pl-3 pr-10 shadow-sm',
        traitElement && 'border-blueHighlight'
      )}
    >
      {traitElement ? (
        <>
          <div className='flex flex-row items-center space-x-3 py-2'>
            <Image
              priority
              width={18}
              height={18}
              src={cld
                .image(`${clientEnv.NEXT_PUBLIC_NODE_ENV}/${repositoryId}/${traitElement.layerElementId}/${traitElement.id}`)
                .toURL()}
              className='rounded-[3px]'
            />
            <div className='flex flex-row space-x-2 items-center'>
              <span className={clsx('block truncate text-xs tracking-tight text-darkGrey')}>{layerName}</span>
              <span className={clsx('block truncate text-sm text-black')}>{traitElement.name}</span>
            </div>
          </div>
        </>
      ) : (
        <input className='w-full h-full py-2 focus:outline-none' placeholder='Search a trait...' />
      )}
    </div>
  )
}

export const RuleSelectorCombobox = ({
  traitElements,
  selected,
  onChange,
}: {
  traitElements: TraitElement[]
  selected: TraitElement | null | undefined
  onChange: Dispatch<SetStateAction<TraitElement | null | undefined>>
}) => {
  const [query, setQuery] = useState('')
  const { data: layers } = useQueryRepositoryLayer()
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
        // placeholder='Search a trait...'
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
                    <SmallAdvancedImage url={`${traitElement.layerElementId}/${traitElement.id}`} />
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

export default RuleSelector
