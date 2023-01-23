import { useQueryContractDeploymentProduction } from '@components/explore/SaleLayout/useQueryContractDeploymentProduction'
import Card from '@components/layout/card/Card'
import NextLinkComponent from '@components/layout/link/NextLink'
import { createLogoUrl } from '@components/layout/LogoDisplay'
import { TextWithLiveStatus } from '@components/layout/TextWithStatus'
import { CollectionIcon, CubeIcon } from '@heroicons/react/outline'
import type { Repository } from '@prisma/client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { routeBuilder, toPascalCaseWithSpace } from 'src/client/utils/format'

export const RepositoryDisplayCard = ({ organisationName, repository }: { organisationName: string; repository: Repository }) => {
  const { current } = useQueryContractDeploymentProduction({ repositoryName: repository.name })
  const [imgSrc, setImgSrc] = useState<string | null>(repository.id ? createLogoUrl({ id: repository.id }) : null)
  const fetchImage = async () => {
    if (!repository.id) return
    const response = await fetch(createLogoUrl({ id: repository.id }))
    if (!response.ok) {
      setImgSrc(null)
      return
    }
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    setImgSrc(url)
  }

  useEffect(() => {
    fetchImage()
  }, [repository.id])

  return (
    <Card>
      <div className='space-y-0.5'>
        <div className='flex justify-between items-center'>
          <div>
            <h2 className='text-md font-semibold'>{repository.displayName || repository.name}</h2>
            <span className='text-sm text-darkGrey'>{toPascalCaseWithSpace(repository?.category || 'default')}</span>
          </div>
          <div>
            <TextWithLiveStatus />
          </div>
        </div>
      </div>
      <div className='relative h-72 w-full border-mediumGrey border rounded-[5px] overflow-hidden bg-lightGray'>
        {imgSrc && (
          <Image className='absolute w-full object-cover aspect-1 rounded-[5px]' alt={`logo-${repository.id}`} src={imgSrc} fill />
        )}
      </div>
      <div className='space-y-1'>
        {[
          // {
          //   label: 'Price',
          //   value: '0.01 ETH',
          //   icon: (props: any) => <CurrencyDollarIcon {...props} />,
          // },
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
