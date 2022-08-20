import AdvancedImage from '@components/CollectionHelpers/AdvancedImage'
import { Button } from '@components/UI/Button'
import { Combobox } from '@headlessui/react'
import { TrashIcon } from '@heroicons/react/outline'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { toPascalCaseWithSpace } from '@utils/format'
import { LayerElement, TraitElement } from '@utils/types'
import { NextRouter, useRouter } from 'next/router'
import { useState } from 'react'
import { classNames } from '../../utils/classnames'

export const RuleConditionSelector = ({
  layers,
  title,
  disabled = false,
}: {
  layers: LayerElement[]
  title: string
  disabled?: boolean
}) => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const [query, setQuery] = useState('')
  const [selectedLayerTrait, setSelectedLayerTrait] = useState()
  const [selectedCondition, setSelectedCondition] = useState()
  const [selectedLayerTraitRight, setSelectedLayerTraitRight] = useState()

  return (
    <div key={query} className='w-full flex flex-col space-y-3'>
      <span
        className={`block text-xs font-semibold uppercase ${
          disabled ? 'text-darkGrey' : ''
        }`}
      >
        {title}
      </span>
      <div className='grid grid-cols-10 space-x-3'>
        <div className='col-span-3 relative mt-1'>
          <Combobox
            as='div'
            value={selectedLayerTrait}
            onChange={setSelectedLayerTrait}
          >
            <Combobox.Input
              className='w-full rounded-[5px] border border-lightGray bg-hue-light py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm'
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(trait: TraitElement) => trait?.name}
              placeholder='Select a Trait or Layer'
            />
            <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
              <SelectorIcon
                className='h-5 w-5 text-lightGray'
                aria-hidden='true'
              />
            </Combobox.Button>
            {layers.length > 0 && (
              <Combobox.Options className='absolute z-10 mt-1 max-h-60 w-[25rem] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                {layers.map((layer: LayerElement) => {
                  return layer.traits.map((trait: TraitElement) => (
                    <Combobox.Option
                      key={`${layer.id}-${trait.id}`}
                      value={trait}
                      className={({ active }) =>
                        classNames(
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                          active ? 'text-blueHighlight' : 'text-darkGrey'
                        )
                      }
                    >
                      {({ active, selected }) => (
                        <div className='flex flex-row items-center space-x-3'>
                          <AdvancedImage
                            type='sm'
                            url={`${organisationName}/${repositoryName}/layers/${
                              layer.name
                            }/${toPascalCaseWithSpace(trait.name)}.png`}
                          />
                          <div className='flex flex-row space-x-2 items-center'>
                            <span
                              className={classNames(
                                'block truncate text-xs tracking-tight',
                                selected && 'font-semibold'
                              )}
                            >
                              {layer.name}
                            </span>
                            <span
                              className={classNames(
                                'block truncate',
                                selected && 'font-semibold'
                              )}
                            >
                              {trait.name}
                            </span>
                          </div>

                          {selected && (
                            <span
                              className={classNames(
                                'absolute inset-y-0 right-0 flex items-center pr-4',
                                active ? 'text-black' : 'text-indigo-600'
                              )}
                            >
                              <CheckIcon
                                className='h-5 w-5'
                                aria-hidden='true'
                              />
                            </span>
                          )}
                        </div>
                      )}
                    </Combobox.Option>
                  ))
                })}
              </Combobox.Options>
            )}
          </Combobox>
        </div>
        <div className='col-span-2 relative mt-1'>
          <Combobox
            as='div'
            value={selectedCondition}
            onChange={setSelectedCondition}
          >
            <Combobox.Input
              className='w-full rounded-[5px] border border-lightGray bg-hue-light py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm'
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(trait: TraitElement) => trait?.name}
              placeholder='cannot mix with'
            />
            <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
              <SelectorIcon
                className='h-5 w-5 text-lightGray'
                aria-hidden='true'
              />
            </Combobox.Button>
            {['cannot mix with', 'only mixes with', 'always mixes with']
              .length > 0 && (
              <Combobox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                {[
                  { id: 0, name: 'cannot mix with' },
                  { id: 2, name: 'only mixes with' },
                  { id: 3, name: 'always mixes with' },
                ].map((layer) => (
                  <Combobox.Option
                    key={layer.id}
                    value={layer}
                    className={({ active }) =>
                      classNames(
                        'relative cursor-default select-none py-2 pl-3 pr-9',
                        active ? 'text-blueHighlight' : 'text-black'
                      )
                    }
                  >
                    {({ active, selected }) => (
                      <>
                        <span
                          className={classNames(
                            'block truncate',
                            selected && 'font-semibold'
                          )}
                        >
                          {layer.name}
                        </span>
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
            )}
          </Combobox>
        </div>
        <div className='col-span-4 relative mt-1'>
          <Combobox
            as='div'
            value={selectedLayerTraitRight}
            onChange={setSelectedLayerTraitRight}
          >
            <Combobox.Input
              className='w-full rounded-[5px] border border-lightGray bg-hue-light py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm'
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(trait: TraitElement) => trait?.name}
              placeholder='Select a Trait or Layer'
            />
            <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
              <SelectorIcon
                className='h-5 w-5 text-lightGray'
                aria-hidden='true'
              />
            </Combobox.Button>
            {layers.length > 0 && (
              <Combobox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                {layers.map((layer: LayerElement) => {
                  return layer.traits.map((trait: TraitElement) => (
                    <Combobox.Option
                      key={`${layer.id}-${trait.id}`}
                      value={trait}
                      className={({ active }) =>
                        classNames(
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                          active ? 'text-blueHighlight' : 'text-darkGrey'
                        )
                      }
                    >
                      {({ active, selected }) => (
                        <div className='flex flex-row items-center space-x-3'>
                          <AdvancedImage
                            type='sm'
                            url={`${organisationName}/${repositoryName}/layers/${
                              layer.name
                            }/${toPascalCaseWithSpace(trait.name)}.png`}
                          />
                          <div className='flex flex-row space-x-2 items-center'>
                            <span
                              className={classNames(
                                'block truncate text-xs tracking-tight',
                                selected && 'font-semibold'
                              )}
                            >
                              {layer.name}
                            </span>
                            <span
                              className={classNames(
                                'block truncate',
                                selected && 'font-semibold'
                              )}
                            >
                              {trait.name}
                            </span>
                          </div>

                          {selected && (
                            <span
                              className={classNames(
                                'absolute inset-y-0 right-0 flex items-center pr-4',
                                active ? 'text-black' : 'text-indigo-600'
                              )}
                            >
                              <CheckIcon
                                className='h-5 w-5'
                                aria-hidden='true'
                              />
                            </span>
                          )}
                        </div>
                      )}
                    </Combobox.Option>
                  ))
                })}
              </Combobox.Options>
            )}
          </Combobox>
        </div>
        <div className='col-span-1 relative mt-1 flex items-center right-0 justify-center'>
          {disabled ? (
            <TrashIcon className='h-5 w-5 text-lightGray' />
          ) : (
            <Button>Add</Button>
          )}
        </div>
      </div>
    </div>
  )
}
