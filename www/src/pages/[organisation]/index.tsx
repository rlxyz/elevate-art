import { CollectionSocialMediaLinks } from '@components/explore/CollectionLayout/CollectionSocialMediaLinks'
import AvatarComponent from '@components/layout/avatar/Avatar'
import { BannerDisplay } from '@components/layout/BannerDisplay'
import Card from '@components/layout/card/Card'
import { DescriptionWithDisclouser } from '@components/layout/DescriptionWithDisclouser'
import AppRoutesNavbar from '@components/layout/header/AppRoutesNavbarProps'
import NextLinkComponent from '@components/layout/link/NextLink'
import SearchComponent from '@components/layout/search/Search'
import { OrganisationRoutesNavbarPopover } from '@components/organisation/OrganisationRoutesNavbar'
import { CollectionIcon, CubeIcon, CurrencyDollarIcon } from '@heroicons/react/outline'
import { useQueryOrganisationFindAllRepositoryProduction } from '@hooks/trpc/organisation/useQueryOrganisationFindAllRepositoryProduction'
import { useQueryOrganisationFindByName } from '@hooks/trpc/organisation/useQueryOrganisationFindByName'
import type { Organisation, Repository } from '@prisma/client'
import { ZoneNavigationEnum } from '@utils/enums'
import type { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Layout } from 'src/client/components/layout/core/Layout'
import { routeBuilder } from 'src/client/utils/format'

const OrganisationDisplayProfile = ({ organisation }: { organisation: Organisation | undefined | null }) => {
  return (
    <div className='flex flex-row space-x-6'>
      <div>
        <AvatarComponent src={organisation?.logoImageUrl || '/images/avatar-blank.png'} alt='team-logo' variant='lg' />
      </div>
      <div className='flex flex-col justify-center space-y-1'>
        <h1 className='text-sm font-bold'>{organisation?.name}</h1>
        {organisation?.description && <DescriptionWithDisclouser description={organisation?.description} />}
      </div>
    </div>
  )
}

const OrganisationDisplayHeader = ({ organisation }: { organisation: Organisation | undefined | null }) => {
  return (
    <div className='space-y-16'>
      <div className='w-full flex justify-between items-center'>
        <div className='w-1/2'>
          <OrganisationDisplayProfile organisation={organisation} />
        </div>
        <div>
          <CollectionSocialMediaLinks
            discordUrl={organisation?.discordUrl}
            twitterUrl={organisation?.twitterUrl}
            instagramUrl={organisation?.instagramUrl}
          />
          <NextLinkComponent href={routeBuilder(organisation?.name, ZoneNavigationEnum.enum.Create)}>
            <span className='text-xs border p-2 rounded-[5px] bg-blueHighlight text-white border-mediumGrey'>Admin View</span>
          </NextLinkComponent>
        </div>
      </div>
      <BannerDisplay src={organisation?.bannerImageUrl} />
    </div>
  )
}

const RepositoryDisplayCard = ({ repository, state }: { repository: Repository; state?: 'LIVE' }) => {
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
    </Card>
  )
}

const OrganisationDisplayBody = ({
  organisation,
  repositories,
}: {
  organisation: Organisation | undefined | null
  repositories: Repository[] | undefined | null
}) => {
  return (
    <div className='space-y-6'>
      <span className='font-semibold'>{organisation?.name}&apos;s Collections</span>
      <SearchComponent />
      <div className='grid grid-cols-3 gap-6'>
        {repositories?.map((r) => (
          <RepositoryDisplayCard key={r.name} repository={r} />
        ))}
      </div>
    </div>
  )
}

const OrganisationDisplayLayout = ({
  organisation,
  repositories,
}: {
  organisation: Organisation | undefined | null
  repositories: Repository[] | undefined | null
}) => {
  return (
    <div className='py-8 space-y-16'>
      <OrganisationDisplayHeader organisation={organisation} />
      <OrganisationDisplayBody organisation={organisation} repositories={repositories} />
    </div>
  )
}

const Page: NextPage = () => {
  const router = useRouter()
  const { organisation: o } = router.query as { organisation: string }
  const { current: organisation } = useQueryOrganisationFindByName({ name: o })
  const { all: repositories } = useQueryOrganisationFindAllRepositoryProduction({ organisationName: o })
  return (
    <Layout>
      <Layout.AppHeader border='lower'>
        <AppRoutesNavbar>
          <AppRoutesNavbar.Item label={organisation?.name || ''} href={routeBuilder(organisation?.name)}>
            <OrganisationRoutesNavbarPopover />
          </AppRoutesNavbar.Item>
        </AppRoutesNavbar>
      </Layout.AppHeader>
      {/* <Layout.PageHeader>
        <PageRoutesNavbar>
          {[
            {
              name: OrganisationNavigationEnum.enum.Overview,
              href: routeBuilder(organisation?.name),
              enabled: true,
              loading: false,
            },
            {
              name: DashboardNavigationEnum.enum.Account,
              href: routeBuilder(organisation?.name, OrganisationNavigationEnum.enum.Settings),
              enabled: false,
              loading: false,
            },
          ].map((item) => (
            <PageRoutesNavbar.Item key={item.name} opts={item} />
          ))}
        </PageRoutesNavbar>
      </Layout.PageHeader> */}
      <Layout.Body>
        <div className='py-8'>
          <OrganisationDisplayLayout organisation={organisation} repositories={repositories} />
        </div>
      </Layout.Body>
    </Layout>
  )
}

export default Page
