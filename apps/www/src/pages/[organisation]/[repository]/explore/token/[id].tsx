import { AnalyticsLayout } from '@components/explore/AnalyticsLayout/AnalyticsLayout'
import { AnalyticsLayoutCollectionInformation } from '@components/explore/AnalyticsLayout/AnalyticsLayoutCollectionInformation'
import { useFetchOwner } from '@components/explore/GalleryLayout/useFetchOwner'
import { useQueryContractDeployment } from '@components/explore/SaleLayout/useQueryContractDeployment'
import { useQueryContractDeploymentProduction } from '@components/explore/SaleLayout/useQueryContractDeploymentProduction'
import AvatarComponent from '@components/layout/avatar/Avatar'
import { Layout } from '@components/layout/core/Layout'
import { FilterWithTextLive } from '@components/layout/FilterWithTextLive'
import AppRoutesNavbar, { ZoneRoutesNavbarPopover } from '@components/layout/header/AppRoutesNavbarProps'
import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import NextLinkComponent from '@components/layout/link/NextLink'
import Tooltip from '@components/layout/tooltip'
import { CubeIcon, ExternalLinkIcon } from '@heroicons/react/outline'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import { useQueryRepositoryHasProductionDeployment } from '@hooks/trpc/repository/useQueryRepositoryHasProductionDeployment'
import type { ContractDeployment } from '@prisma/client'
import { AssetDeploymentBranch } from '@prisma/client'
import type { TokenMetadata } from '@utils/contracts/ContractData'
import { ZoneNavigationEnum } from '@utils/enums'
import { buildEtherscanLink, formatEthereumHash, parseChainId } from '@utils/ethers'
import type { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { capitalize, routeBuilder, truncate } from 'src/client/utils/format'
import { getTokenImageURI, getTokenURI } from 'src/client/utils/image'

export const useFetchTokenURI = ({
  contractDeployment,
  tokenId,
}: {
  contractDeployment: ContractDeployment | undefined | null
  tokenId: number
}) => {
  const [attributes, setAttributes] = useState<TokenMetadata['attributes'] | undefined>(undefined)

  // fetch owner from from api/assets/:chainId/:contractAddress/:tokenId/owner
  const fetchData = async () => {
    if (!contractDeployment) return
    try {
      const response = await fetch(
        getTokenURI({
          contractDeployment,
          tokenId,
        })
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.error(error)
      return error
    }
  }

  useEffect(() => {
    fetchData().then((x: TokenMetadata) => {
      if (x?.attributes) setAttributes(x.attributes)
    })
  }, [contractDeployment?.id])

  return { attributes }
}

const TokenLayout = ({
  tokenId,
  branch,
  address = '',
}: {
  branch: AssetDeploymentBranch
  address?: string | undefined | null
  tokenId: number
}) => {
  const { current } = useQueryContractDeployment({ address })
  const { current: hasProductionDeployment } = useQueryRepositoryHasProductionDeployment()
  const { owner } = useFetchOwner({
    contractDeployment: current?.deployment,
    tokenId,
  })
  const { attributes } = useFetchTokenURI({
    contractDeployment: current?.deployment,
    tokenId,
  })

  return (
    <Layout>
      <Layout.AppHeader>
        <AppRoutesNavbar>
          <AppRoutesNavbar.Item
            label={current?.deployment.repository.organisation.name || ''}
            href={routeBuilder(current?.deployment.repository.organisation.name)}
            loading={!current?.deployment.repository.name || !current?.deployment.repository.organisation.name}
          />
          <AppRoutesNavbar.Item
            label={current?.deployment.repository.name || ''}
            href={routeBuilder(current?.deployment.repository.organisation.name, current?.deployment.repository.name)}
            loading={!current?.deployment.repository.name || !current?.deployment.repository.organisation.name}
            disabled={!hasProductionDeployment}
          >
            <FilterWithTextLive />
          </AppRoutesNavbar.Item>
          <AppRoutesNavbar.Item label={capitalize(ZoneNavigationEnum.enum.Explore)} href={`/${ZoneNavigationEnum.enum.Explore}`} disabled>
            <ZoneRoutesNavbarPopover
              title='Apps'
              routes={[
                {
                  label: capitalize(ZoneNavigationEnum.enum.Create),
                  href: `/${ZoneNavigationEnum.enum.Create}`,
                  selected: false,
                  icon: (props: any) => <TriangleIcon className='w-4 h-4' />,
                },
                {
                  label: capitalize(ZoneNavigationEnum.enum.Deployments),
                  href: `/${ZoneNavigationEnum.enum.Deployments}`,
                  selected: false,
                  icon: (props: any) => <CubeIcon className='w-4 h-4' />,
                },
              ]}
            />
          </AppRoutesNavbar.Item>
        </AppRoutesNavbar>
      </Layout.AppHeader>
      <Layout.Body>
        {current && (
          <div className='w-full h-full grid grid-cols-2 gap-9 py-9'>
            <div className='col-span-1'>
              <div className='w-full h-full border border-mediumGrey rounded-[5px] bg-lightGray overflow-hidden'>
                <div className='p-2 flex justify-between items-center'>
                  <div className='relative'>
                    <Tooltip description={`Chain: ${capitalize(parseChainId(current.deployment.chainId))}`}>
                      <Image src='/images/ethereum-logo.svg' alt={'eth-logo'} width={20} height={20} className='text-darkGrey border' />
                    </Tooltip>
                  </div>
                  <div>
                    <NextLinkComponent
                      rel='noopener noreferrer'
                      target={'_blank'}
                      href={getTokenImageURI({
                        contractDeployment: current?.deployment,
                        tokenId,
                      })}
                    >
                      <ExternalLinkIcon className='w-4 h-4 text-black' />
                    </NextLinkComponent>
                  </div>
                </div>
                <Image
                  src={getTokenImageURI({ contractDeployment: current?.deployment, tokenId })}
                  onErrorCapture={(e) => {
                    e.currentTarget.src = '/images/placeholder.png'
                  }}
                  width={current?.deployment.repository.width || 600}
                  height={current?.deployment.repository.height || 600}
                  alt={`${address}-#${tokenId}`}
                  className='object-cover m-auto bg-lightGray'
                />
              </div>
            </div>
            <div className='col-span-1'>
              <div className='space-y-6'>
                <div className='flex w-max items-center'>
                  <NextLinkComponent
                    href={routeBuilder(current?.deployment.repository.organisation.name, current.deployment.repository.name)}
                    color
                  >
                    {current.deployment.repository.name}
                  </NextLinkComponent>
                  <BadgeCheckIcon className='w-6 h-6 text-blueHighlight' />
                </div>
                <div className='space-y-3'>
                  <span className='text-3xl font-black'>
                    {current.deployment.repository.tokenName} #{tokenId}
                  </span>
                  <div className='flex flex-row space-x-3 w-full'>
                    {owner && (
                      <NextLinkComponent
                        target='_blank'
                        rel='noopener noreferrer'
                        href={buildEtherscanLink({
                          chainId: current.deployment.chainId,
                          address: owner,
                        })}
                        underline
                      >
                        <div className='flex items-center space-x-2'>
                          <AvatarComponent src='/images/avatar-blank.png' />
                          <span className='text-xs'>{formatEthereumHash(owner)}</span>
                        </div>
                      </NextLinkComponent>
                    )}
                  </div>
                </div>
                <div>
                  <AnalyticsLayout>
                    <AnalyticsLayout.Header title='Attributes' />
                    <AnalyticsLayout.Body>
                      <div className='grid grid-cols-3 gap-3'>
                        {attributes?.map((attribute) => (
                          <div
                            key={`${attribute.trait_type}-${attribute.value}`}
                            className='w-full border border-blueHighlight rounded-[5px] p-2 flex items-center justify-center bg-blueHighlight bg-opacity-5 ring-1 ring-blueHighlight hover:bg-opacity-10 overflow-hidden'
                          >
                            <div className='flex flex-col items-center space-y-1'>
                              <div className='text-[0.6rem] font-semibold whitespace-nowrap overflow-hidden'>{attribute.trait_type}</div>
                              <div className='text-xs font-bold whitespace-nowrap overflow-hidden'>
                                {truncate(attribute.value || '', 'lg')}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AnalyticsLayout.Body>
                  </AnalyticsLayout>
                </div>
                <AnalyticsLayoutCollectionInformation contractDeployment={current.deployment} />
              </div>
            </div>
          </div>
        )}
      </Layout.Body>
    </Layout>
  )
}

const Page: NextPage = () => {
  const { current } = useQueryContractDeploymentProduction({})
  const router = useRouter()
  const { id } = router.query as { id: string }
  if (isNaN(Number(id))) {
    router.push('/404')
  }
  return <TokenLayout tokenId={Number(id)} address={current?.address} branch={AssetDeploymentBranch.PRODUCTION} />
}

export default Page
