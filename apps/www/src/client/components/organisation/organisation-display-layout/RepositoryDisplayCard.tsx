import { useQueryContractDeploymentProduction } from '@components/explore/SaleLayout/useQueryContractDeploymentProduction'
import Card from '@components/layout/card/Card'
import NextLinkComponent from '@components/layout/link/NextLink'
import { createLogoUrl } from '@components/layout/LogoDisplay'
import type { Repository } from '@prisma/client'
import Image from 'next/image'
import { routeBuilder } from 'src/client/utils/format'

export const RepositoryDisplayCard = ({ organisationName, repository }: { organisationName: string; repository: Repository }) => {
  const { current } = useQueryContractDeploymentProduction({ repositoryName: repository.name })
  // const [imgSrc, setImgSrc] = useState<string | null>(repository.id ? createLogoUrl({ id: repository.id }) : null)
  // const fetchImage = async () => {
  //   if (!repository.id) return
  //   const response = await fetch(createLogoUrl({ id: repository.id }))
  //   if (!response.ok) {
  //     setImgSrc(null)
  //     return
  //   }
  //   const blob = await response.blob()
  //   const url = URL.createObjectURL(blob)
  //   setImgSrc(url)
  // }

  // useEffect(() => {
  //   fetchImage()
  // }, [repository.id])

  return (
    <Card padding={'none'} className='overflow-hidden'>
      <NextLinkComponent className='flex flex-col w-full' href={routeBuilder(organisationName, repository.name)}>
        <div className='relative h-96 w-full overflow-hidden bg-lightGray border-b border-mediumGrey'>
          <Image
            className='w-full object-cover aspect-1'
            alt={`logo-${repository.id}`}
            src={createLogoUrl({
              id: repository.id,
            })}
            width={1000}
            height={1000}
          />
        </div>
        <div className='p-5 space-y-3'>
          <div className='space-x-1 flex items-center'>
            <span className='text-2xl font-black'>{repository.displayName || repository.name}</span>
          </div>
          <div className='text-xs text-darkGrey'>Price</div>
          <span className='text-lg font-semibold'>Free Claim</span>
        </div>
      </NextLinkComponent>
    </Card>
  )
}
