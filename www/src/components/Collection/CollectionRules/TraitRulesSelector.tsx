import { SmallAdvancedImage } from '@components/Collection/CollectionHelpers/AdvancedImage'
import Button from '@components/UI/Button'
import { Combobox } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import useCollectionNavigationStore from '@hooks/useCollectionNavigationStore'
import { useNotification } from '@hooks/useNotification'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { Rules, TraitElement } from '@prisma/client'
import { classNames } from '@utils/format'
import { trpc } from '@utils/trpc'
import router from 'next/router'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { RulesEnum, RulesType } from 'src/types/enums'

export const TraitRulesSelector = ({
  title,
  traitElements,
}: {
  title: string
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
}) => {
  const [selectedCondition, setSelectedCondition] = useState<RulesType | null | string>()
  const [selectedLeftTrait, setSelectedLeftTrait] = useState<null | TraitElement>()
  const [selectedRightTrait, setSelectedRightTrait] = useState<null | TraitElement>()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { data: layers } = trpc.useQuery(['repository.getRepositoryLayers', { id: repositoryId }])
  const currentLayerPriority = useCollectionNavigationStore((state) => state.currentLayerPriority)
  const { notifySuccess, notifyError } = useNotification()
  if (!layers) return null
  const allRightTraitElements = layers
    .filter((_, index) => index !== currentLayerPriority)
    .flatMap((layer) => layer.traitElements)
  const ctx = trpc.useContext()

  const mutation = trpc.useMutation('trait.setRuleById', {
    onSuccess: (data, variables) => {
      const primaryLayer = data.layers.filter((layer) => layer.id === (data.primary?.layerElement.id || ''))[0]
      const secondaryLayer = data.layers.filter((layer) => layer.id === (data.secondary?.layerElement.id || ''))[0]
      if (primaryLayer) ctx.setQueryData(['layer.getLayerById', { id: primaryLayer.id }], primaryLayer)
      if (secondaryLayer) ctx.setQueryData(['layer.getLayerById', { id: secondaryLayer.id }], secondaryLayer)
      ctx.setQueryData(['repository.getRepositoryLayers', { id: repositoryId }], data.layers)
      notifySuccess(
        <div>
          <span className='text-blueHighlight text-semibold'>{data.primary?.name}</span>
          <span>{` now ${variables.type} `}</span>
          <span className='font-semibold'>{data.secondary?.name}</span>
        </div>,
        'new rule'
      )
      setSelectedRightTrait(null)
    },
    onError: () => {
      notifyError('Something went wrong')
    },
  })

  return (
    <div className='w-full flex flex-col space-y-3'>
      <span className='block text-xs font-semibold uppercase'>{title}</span>
      <div className='grid grid-cols-10 space-x-3'>
        <div className='col-span-3 relative mt-1'>
          <TraitSelector traitElements={traitElements} selected={selectedLeftTrait} onChange={setSelectedLeftTrait} />
        </div>
        <div className='col-span-2 relative mt-1'>
          <TraitSelectorCondition selected={selectedCondition} onChange={setSelectedCondition} />
        </div>
        <div className='col-span-4 relative mt-1'>
          <TraitSelector
            traitElements={allRightTraitElements}
            selected={selectedRightTrait}
            onChange={setSelectedRightTrait}
          />
        </div>
        <div className='col-span-1 relative mt-1 flex items-center right-0 justify-center'>
          <Button
            className='w-full'
            disabled={!(selectedCondition && selectedLeftTrait && selectedRightTrait) || mutation.isLoading}
            onClick={() => {
              if (!(selectedCondition && selectedLeftTrait && selectedRightTrait)) return
              mutation.mutate({
                repositoryId: repositoryId,
                primaryTraitElementId: selectedLeftTrait.id,
                type: selectedCondition,
                secondaryTraitElementId: selectedRightTrait.id,
              })
            }}
          >
            Add Rule
          </Button>
        </div>
      </div>
    </div>
  )
}

export const TraitSelectorCondition = ({
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
        className='w-full rounded-[5px] border border-mediumGrey bg-hue-light py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm'
        onChange={(event) => setQuery(event.target.value)}
        displayValue={(value: string) => value}
        placeholder='cannot mix with'
      />
      <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
        <SelectorIcon className='h-5 w-5 text-mediumGrey' aria-hidden='true' />
      </Combobox.Button>
      <Combobox.Options className='absolute z-10 mt-1 max-h-60 min-w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
        {filteredConditions.map((option, index) => (
          <Combobox.Option
            key={index}
            value={option.name}
            className={({ active }) =>
              classNames(
                'relative cursor-default select-none py-2 pl-3 pr-9',
                active ? 'text-blueHighlight' : 'text-black'
              )
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

export const TraitSelector = ({
  traitElements,
  selected,
  onChange,
}: {
  traitElements: TraitElement[]
  selected: TraitElement | null | undefined
  onChange: Dispatch<SetStateAction<TraitElement | null | undefined>>
}) => {
  const [query, setQuery] = useState('')
  const currentLayerPriority = useCollectionNavigationStore((state) => state.currentLayerPriority)
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { data: layers } = trpc.useQuery(['repository.getRepositoryLayers', { id: repositoryId }])
  const filteredTraits =
    query === ''
      ? traitElements
      : traitElements.filter((traitElement) => {
          return traitElement.name.toLowerCase().includes(query.toLowerCase())
        })

  useEffect(() => onChange(null), [currentLayerPriority])

  if (!layers) return null

  return (
    <Combobox as='div' value={selected} onChange={onChange}>
      <Combobox.Input
        className='w-full rounded-[5px] border border-mediumGrey bg-hue-light py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm'
        onChange={(event) => setQuery(event.target.value)}
        displayValue={(traitElement: TraitElement) => traitElement?.name}
        placeholder='Select a Trait or Layer'
      />
      <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
        <SelectorIcon className='h-5 w-5 text-mediumGrey' aria-hidden='true' />
      </Combobox.Button>
      {filteredTraits.length > 0 && (
        <Combobox.Options className='absolute z-10 mt-1 max-h-60 min-w-full max-w-[calc(100% + 5rem)] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
          {filteredTraits.map((traitElement) => (
            <Combobox.Option
              key={traitElement.id}
              value={traitElement}
              className={({ active }) =>
                classNames(
                  'relative cursor-default select-none py-2 pl-3 pr-9',
                  active ? 'text-blueHighlight' : 'text-darkGrey'
                )
              }
            >
              {({ active, selected }) => (
                <>
                  <div className='flex flex-row items-center space-x-3'>
                    <SmallAdvancedImage url={`${traitElement.layerElementId}/${traitElement.id}`} />
                    <div className='flex flex-row space-x-2 items-center'>
                      <span
                        className={classNames('block truncate text-xs tracking-tight', selected ? 'font-semibold' : '')}
                      >
                        {layers.filter((layer) => layer.id === traitElement.layerElementId)[0]?.name}
                      </span>
                      <span className={classNames('block truncate', selected ? 'font-semibold' : '')}>
                        {traitElement.name}
                      </span>
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
