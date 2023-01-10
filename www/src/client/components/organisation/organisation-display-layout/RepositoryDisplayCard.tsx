import Card from '@components/layout/card/Card'
import { CollectionIcon, CubeIcon, CurrencyDollarIcon } from '@heroicons/react/outline'
import type { Repository } from '@prisma/client'
import Image from 'next/image'

export const RepositoryDisplayCard = ({ repository, state }: { repository: Repository; state?: 'LIVE' }) => {
  return (
    <Card>
      <div className='space-y-0.5'>
        <div className='flex justify-between items-center'>
          <div>
            <h2 className='text-md font-semibold'>{repository.name}</h2>
          </div>
          <div>
            {state === 'LIVE' && (
              <span className='inline-flex items-center rounded-full bg-lightGray bg-opacity-40 border border-mediumGrey py-1 px-2 lg:text-xs text-[0.6rem] font-medium text-black'>
                Live
              </span>
            )}
          </div>
        </div>
      </div>
      <div className='relative h-72 w-full border-mediumGrey border rounded-[5px] overflow-hidden bg-lightGray'>
        {repository.logoImageUrl && (
          <Image fill className='absolute w-full object-cover rounded-[5px]' alt='' src={repository.logoImageUrl} />
        )}
      </div>
      <div className='space-y-1'>
        {[
          {
            label: 'Price',
            value: '0.01 ETH',
            icon: (props: any) => <CurrencyDollarIcon {...props} />,
          },
          {
            label: 'Collection',
            value: '1',
            icon: (props: any) => <CollectionIcon {...props} />,
          },
          {
            label: 'Editions',
            value: 'ERC721',
            icon: (props: any) => <CubeIcon {...props} />,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className='flex justify-between items-center'>
            <div className='flex items-center space-x-1'>
              <Icon className='h-4 w-4 text-black' />
              <span className='text-sm'>{label}</span>
            </div>
            <span className='text-xs text-darkGrey'>{value}</span>
          </div>
        ))}
      </div>
      <button className='w-full bg-black p-2 text-white rounded-[5px]'>Mint</button>
    </Card>
  )
}
