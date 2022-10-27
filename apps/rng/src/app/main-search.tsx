'use client'
import { Link, Search } from '@elevateart/ui'
import clsx from 'clsx'

import { Combobox } from '@headlessui/react'
import { useState } from 'react'

import { Transition } from '@headlessui/react'
import Image from 'next/image'
import { Fragment } from 'react'

type Contract = { address: string; name: string; imageUrl: string }
const contracts: Contract[] = [
  { address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', name: 'Bored Ape Yatch Club', imageUrl: '/images/bayc.avif' },
  { address: '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b', name: 'CloneX', imageUrl: '/images/clonex.avif' },
  { address: '0x23581767a106ae21c074b2276d25e5c3e136a68b', name: 'Moonbirds', imageUrl: '/images/moonbirds.avif' },
]

const Example = () => {
  const [selected, setSelected] = useState<Contract>(contracts[0])
  const [query, setQuery] = useState<string>('')

  const filteredContracts =
    query === ''
      ? contracts
      : contracts.filter((contract) =>
          contract.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  return (
    <Combobox value={selected} onChange={setSelected}>
      <div className='relative mt-1'>
        <div className='relative w-full cursor-default overflow-hidden rounded-primary bg-transparent text-left shadow-md'>
          <Combobox.Input
            as={Search}
            className='w-full'
            focus={false}
            displayValue={(contract: Contract) => contract?.name || ''}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Search the metaverse'
          />
          <Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-2'>
            {/* <ChevronUpDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' /> */}
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className='absolute mt-4 max-h-60 w-full overflow-auto rounded-primary bg-background py-1 shadow-lg ring-opacity-5 focus:outline-none text-xs no-scrollbar divide-y divide-accents_7'>
            {filteredContracts.length === 0 && query !== '' ? (
              <div className='relative cursor-default select-none py-2 px-4 text-accents_2'>Nothing found.</div>
            ) : (
              filteredContracts.map((contract: Contract) => (
                <Combobox.Option
                  as={Link}
                  key={contract.address}
                  href={`/${contract.address}`}
                  className='relative cursor-pointer select-none py-2 px-4 text-accents_2'
                  value={contract}
                >
                  {({ selected, active }) => (
                    <div className='flex items-center space-x-4'>
                      <Image
                        src={contract.imageUrl}
                        alt={contract.name}
                        width={30}
                        height={30}
                        className='rounded-primary border border-accents_7'
                      />
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{contract.name}</span>
                    </div>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  )
}

export default function Home() {
  const graident = [
    ['from-[#00ffff]', 'to-success'],
    ['from-[#ff3399]', 'to-[#ff3333]'],
  ]
  return (
    <>
      <div className='relative group transition duration-1000'>
        <div
          className={clsx(
            'absolute -inset-1 bg-gradient-to-r rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000',
            // graident[Math.floor(Math.random() * graident.length)].join(' ')
            graident[0]
          )}
        />
        {/* <Search className='w-full' placeholder='Search the metaverse' focus={false} /> */}
        <Example />
      </div>
    </>
  )
}
