'use client'
import { Search } from '@elevateart/ui'
import clsx from 'clsx'

import { Combobox } from '@headlessui/react'
import { useState } from 'react'

import { Transition } from '@headlessui/react'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'
import { capitalize } from '../utils/format'

type Contract = {
  address: string
  name: string
  image: string
  indexed: 'indexing' | 'indexed' | 'not indexed'
  totalSupply: number
}

const contracts: Contract[] = [
  {
    address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
    name: 'Bored Ape Yatch Club',
    image: '/images/bayc.avif',
    totalSupply: 10000,
    indexed: 'not indexed',
  },
  {
    address: '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b',
    name: 'CloneX',
    image: '/images/clonex.avif',
    totalSupply: 20000,
    indexed: 'not indexed',
  },
  {
    address: '0x23581767a106ae21c074b2276d25e5c3e136a68b',
    name: 'Moonbirds',
    image: '/images/moonbirds.avif',
    totalSupply: 10000,
    indexed: 'not indexed',
  },
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
              <div className='relative cursor-default select-none py-2 px-4 text-accents_2'>We only found dust.</div>
            ) : (
              filteredContracts.map((contract: Contract) => (
                <Combobox.Option
                  key={contract.address}
                  className='relative cursor-pointer select-none py-2 px-4 text-accents_2'
                  value={contract}
                >
                  <Link className='flex items-center justify-between' href={`/${contract.address}`}>
                    <div className='flex space-x-3 items-center'>
                      <Image
                        src={contract.image}
                        alt={contract.name}
                        width={30}
                        height={30}
                        className='rounded-primary border border-accents_7'
                      />
                      <div className='flex flex-col'>
                        <span className='text-xs'>{contract.name}</span>
                        <span className='text-[0.65rem] text-accents_6'>{contract.totalSupply} items</span>
                      </div>
                    </div>
                    <span className='inline-flex items-center rounded-full bg-accents_8 bg-opacity-40 border border-border py-1 px-2 text-xs font-medium text-foreground'>
                      {capitalize(contract.indexed)}
                    </span>
                  </Link>
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
    <div className='relative group transition duration-1000 w-full'>
      <div
        className={clsx(
          'absolute -inset-1 bg-gradient-to-r rounded-lg blur opacity-10 group-hover:opacity-75 transition duration-1000',
          graident[0]
        )}
      />
      <Example />
    </div>
  )
}
