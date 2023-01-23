import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import clsx from 'clsx'

export const DescriptionWithDisclouser = ({ description }: { description: string }) => {
  return (
    <div>
      <Disclosure>
        <Disclosure.Button className={clsx('border-mediumGrey w-full flex items-center space-x-1')}>
          <h2 className='text-xs font-normal'>See description</h2>
          <ChevronDownIcon className='w-3 h-3' />
        </Disclosure.Button>
        <Disclosure.Panel>
          <p className='my-1 text-[0.6rem] italic'>{description}</p>
        </Disclosure.Panel>
      </Disclosure>
    </div>
  )
}
