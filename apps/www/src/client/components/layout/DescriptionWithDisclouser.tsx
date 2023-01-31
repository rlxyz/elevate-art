import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import type { Organisation, Repository } from '@prisma/client'
import clsx from 'clsx'
import { routeBuilder } from 'src/client/utils/format'
import NextLinkComponent from './link/NextLink'

export const OrganisationDescriptionWithDisclouser = ({ organisation }: { organisation: Organisation | undefined | null }) => {
  if (!organisation) return null
  return (
    <div className='space-y-3'>
      <div className='text-2xl font-bold flex items-center space-x-1'>
        <span>{organisation?.name}</span>
        <BadgeCheckIcon className='w-6 h-6 text-blueHighlight' />
      </div>
      {organisation.description && (
        <Disclosure>
          <Disclosure.Button className={clsx('border-mediumGrey w-full flex items-center space-x-1')}>
            <h2 className='text-xs font-normal'>See description</h2>
            <ChevronDownIcon className='w-3 h-3' />
          </Disclosure.Button>
          <Disclosure.Panel>
            <p className='my-1 text-xs italic'>{organisation.description}</p>
          </Disclosure.Panel>
        </Disclosure>
      )}
    </div>
  )
}

export const RepositoryDescriptionWithDisclouser = ({
  repository,
  organisation,
}: {
  repository: Repository | undefined | null
  organisation: Organisation | undefined | null
}) => {
  if (!repository) return null
  return (
    <div className='space-y-3'>
      <div className='text-2xl font-bold flex items-center space-x-1'>
        <span>{repository?.name}</span>
        <BadgeCheckIcon className='w-6 h-6 text-blueHighlight' />
      </div>
      <div className='flex space-x-1'>
        <h2 className='text-xs'>By</h2>
        <NextLinkComponent href={routeBuilder(organisation?.name)} className='text-xs font-bold' underline>
          {organisation?.name}
        </NextLinkComponent>
      </div>
      {repository.description && (
        <Disclosure>
          <Disclosure.Button className={clsx('border-mediumGrey w-full flex items-center space-x-1')}>
            <h2 className='text-xs font-normal'>See description</h2>
            <ChevronDownIcon className='w-3 h-3' />
          </Disclosure.Button>
          <Disclosure.Panel>
            <p className='my-1 text-xs italic'>{repository.description}</p>
          </Disclosure.Panel>
        </Disclosure>
      )}
    </div>
  )
}
