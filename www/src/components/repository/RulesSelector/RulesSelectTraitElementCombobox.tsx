import { Combobox } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { TraitElementWithImage, TraitElementWithRules, useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import { useDeepCompareEffect } from '@hooks/utils/useDeepCompareEffect'
import { TraitElement } from '@prisma/client'
import { classNames } from '@utils/format'
import clsx from 'clsx'
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'
import { RulesComboboxInput } from '../RulesDisplay/RulesComboboxInput'

export const RulesSelectTraitElementCombobox = ({
  traitElements,
  selected,
  onChange,
}: {
  traitElements: TraitElementWithImage[]
  selected: null | TraitElementWithRules
  onChange: Dispatch<SetStateAction<TraitElementWithRules | null>>
}) => {
  const [query, setQuery] = useState('')
  const { all: layers } = useQueryRepositoryLayer()
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
        as={RulesComboboxInput}
        className={clsx(selected && 'border-blueHighlight')}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
        displayValue={(traitElement: TraitElement) => traitElement?.name}
        placeholder='Select Trait'
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
                        <img src={traitElement.imageUrl} className='rounded-[3px]' />
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
