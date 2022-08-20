import { Button } from '@components/UI/Button';
import { Combobox } from '@headlessui/react';
import { TrashIcon } from '@heroicons/react/outline';
import { SelectorIcon } from '@heroicons/react/solid';
import { TraitElement } from '@utils/types';
import { useEffect, useState } from 'react';

export const RuleConditionDisplay = ({
  title, traits, condition, disabled = false,
}: {
  title: string;
  traits: TraitElement[];
  condition: 'cannot mix with' | 'only mixes with' | 'always mixes with';
  disabled?: boolean;
}) => {
  const [query, setQuery] = useState('');
  const [selectedLayerTrait, setSelectedLayerTrait] = useState();
  const [currentTraits, setCurrentTraits] = useState<TraitElement[]>([]);

  useEffect(() => {
    // console.log(traits)
    setCurrentTraits(traits);
  }, [title, query]);

  return (
    <div className='w-full flex flex-col space-y-3'>
      <span
        className={`block text-xs font-semibold uppercase ${disabled ? 'text-darkGrey' : ''}`}
      >
        {title}
      </span>
      {currentTraits &&
        currentTraits.map((trait: TraitElement, index) => (
          <div className='grid grid-cols-10 space-x-3' key={index}>
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
                  displayValue={(_) => trait?.name}
                  placeholder='Select a Trait or Layer' />
                <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
                  <SelectorIcon
                    className='h-5 w-5 text-lightGray'
                    aria-hidden='true' />
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
                  placeholder='cannot mix with' />
                <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
                  <SelectorIcon
                    className='h-5 w-5 text-lightGray'
                    aria-hidden='true' />
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
                  placeholder='Select a Trait or Layer' />
                <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
                  <SelectorIcon
                    className='h-5 w-5 text-lightGray'
                    aria-hidden='true' />
                </Combobox.Button>
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
        ))}
    </div>
  );
};
