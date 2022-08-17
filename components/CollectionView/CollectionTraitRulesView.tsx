import { CollectionViewContent } from './ViewContent'
import { Combobox } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { TrashIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import { Button } from '@components/UI/Button'
import { NextRouter, useRouter } from 'next/router'
import AdvancedImage from '@components/CloudinaryImage/AdvancedImage'
import { formatLayerName } from '@utils/format'
import useCompilerViewStore from '@hooks/useCompilerViewStore'
import { LayerElement, TraitElement } from '@utils/types'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const layers = [
  { id: 0, layer: 'Scenery', name: 'Blister-Pack' },
  { id: 1, layer: 'Background', name: 'Carnage-Dark-Grey' },
  { id: 1, layer: 'Background', name: 'Carnage-Pink' },
  { id: 1, layer: 'Background', name: 'Carnage-Purple' },
  { id: 1, layer: 'Background', name: 'Carnage-Yellow' },
]

const RuleConditionSelector = ({
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
    <div className='w-full flex flex-col space-y-3'>
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
                            }/${formatLayerName(trait.name)}.png`}
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
                            }/${formatLayerName(trait.name)}.png`}
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
            <TrashIcon
              className='h-5 w-5 text-lightGray'
              onClick={() => console.log('deleting')}
            />
          ) : (
            <Button>Add</Button>
          )}
        </div>
      </div>
    </div>
  )
}

const RuleConditionDisplay = ({
  title,
  traits,
  condition,
  disabled = false,
}: {
  title: string
  traits: TraitElement[]
  condition: 'cannot mix with' | 'only mixes with' | 'always mixes with'
  disabled?: boolean
}) => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const [query, setQuery] = useState('')
  const [selectedLayerTrait, setSelectedLayerTrait] = useState()

  return (
    <div className='w-full flex flex-col space-y-3'>
      <span
        className={`block text-xs font-semibold uppercase ${
          disabled ? 'text-darkGrey' : ''
        }`}
      >
        {title}
      </span>
      {traits.map((trait: TraitElement, index: number) => (
        <div className='grid grid-cols-10 space-x-3'>
          <div className='col-span-3 relative mt-1'>
            <Combobox
              disabled
              as='div'
              value={selectedLayerTrait}
              onChange={setSelectedLayerTrait}
            >
              <Combobox.Input
                className='w-full rounded-[5px] border border-lightGray bg-hue-light py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm'
                onChange={(event) => setQuery(event.target.value)}
                displayValue={(_) => traits[0]?.name}
                placeholder='Select a Trait or Layer'
              />
              <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
                <SelectorIcon
                  className='h-5 w-5 text-lightGray'
                  aria-hidden='true'
                />
              </Combobox.Button>
            </Combobox>
          </div>
          <div className='col-span-2 relative mt-1'>
            <Combobox
              disabled
              as='div'
              value={selectedLayerTrait}
              onChange={setSelectedLayerTrait}
            >
              <Combobox.Input
                className='w-full rounded-[5px] border border-lightGray bg-hue-light py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm'
                onChange={(event) => setQuery(event.target.value)}
                displayValue={(_) => condition}
                placeholder='cannot mix with'
              />
              <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
                <SelectorIcon
                  className='h-5 w-5 text-lightGray'
                  aria-hidden='true'
                />
              </Combobox.Button>
            </Combobox>
          </div>
          <div className='col-span-4 relative mt-1'>
            <Combobox
              as='div'
              value={selectedLayerTrait}
              onChange={setSelectedLayerTrait}
            >
              <Combobox.Input
                className='w-full rounded-[5px] border border-lightGray bg-hue-light py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm'
                onChange={(event) => setQuery(event.target.value)}
                displayValue={(layer: TraitElement) => layer?.name}
                placeholder='Select a Trait or Layer'
              />
              <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
                <SelectorIcon
                  className='h-5 w-5 text-lightGray'
                  aria-hidden='true'
                />
              </Combobox.Button>
            </Combobox>
          </div>
          <div className='col-span-1 relative mt-1 flex items-center right-0 justify-center'>
            {disabled ? (
              <TrashIcon
                className='h-5 w-5 text-lightGray'
                onClick={() => console.log('deleting')}
              />
            ) : (
              <Button>Add</Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

const CollectionRulesView = () => {
  const layers = useCompilerViewStore((state) => state.layers)
  return (
    <CollectionViewContent
      title={'Trait Rules'}
      description='Set how often you want certain images to appear in the generation'
    >
      <div className='p-8 flex flex-col divide-y divide-lightGray space-y-6'>
        <div>
          <RuleConditionSelector layers={layers} title='Create a condition' />
        </div>
        <div className='pt-6'>
          <RuleConditionDisplay
            title='Background'
            condition='only mixes with'
            traits={layers[0].traits.filter((_) => Math.random() > 0.5)} // todo: fix
            disabled={true}
          />
        </div>
        <div className='pt-6'>
          <RuleConditionDisplay
            title='Arms'
            condition='only mixes with'
            traits={layers[0].traits.filter((_) => Math.random() > 0.5)} // todo: fix
            disabled={true}
          />
        </div>
      </div>
    </CollectionViewContent>
  )
}

export default CollectionRulesView
