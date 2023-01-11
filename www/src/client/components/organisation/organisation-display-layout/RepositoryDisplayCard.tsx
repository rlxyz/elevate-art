import { useQueryContractDeploymentProduction } from '@components/explore/SaleLayout/useQueryContractDeploymentProduction'
import Card from '@components/layout/card/Card'
import NextLinkComponent from '@components/layout/link/NextLink'
import { createLogoUrl } from '@components/layout/LogoDisplay'
import { CollectionIcon, CubeIcon, CurrencyDollarIcon } from '@heroicons/react/outline'
import type { Repository } from '@prisma/client'
import { routeBuilder, toPascalCaseWithSpace } from 'src/client/utils/format'

export const RepositoryDisplayCard = ({
  organisationName,
  repository,
  state,
}: {
  organisationName: string
  repository: Repository
  state?: 'LIVE'
}) => {
  const { current } = useQueryContractDeploymentProduction({
    repositoryName: repository.name,
  })
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
        <img
          className='absolute w-full object-cover aspect-1 rounded-[5px]'
          alt={`logo-${repository.id}`}
          src={createLogoUrl({
            id: repository.id,
          })}
        />
      </div>
      <div className='space-y-1'>
        {[
          {
            label: 'Price',
            value: '0.01 ETH',
            icon: (props: any) => <CurrencyDollarIcon {...props} />,
          },
          {
            label: 'Total Supply',
            value: current?.assetDeployment?.totalSupply,
            icon: (props: any) => <CollectionIcon {...props} />,
          },
          {
            label: 'Type',
            value: toPascalCaseWithSpace(current?.assetDeployment?.type || ''),
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
      <NextLinkComponent
        className='flex w-full bg-black p-2 text-white rounded-[5px] justify-center'
        href={routeBuilder(organisationName, repository.name)}
      >
        Mint
      </NextLinkComponent>
    </Card>
  )
}
