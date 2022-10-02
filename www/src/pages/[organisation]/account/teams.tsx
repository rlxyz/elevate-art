import { Layout } from '@components/Layout/Layout'
import { Link } from '@components/Layout/Link'
import { AccountNavigation } from '@components/Organisation/OrganisationSettings'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { useQueryOrganisationsRepository } from '@hooks/query/useQueryOrganisationsRepository'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { Organisation, OrganisationMember, User } from '@prisma/client'
import { capitalize } from '@utils/format'
import { trpc } from '@utils/trpc'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { OrganisationDatabaseEnum, OrganisationNavigationEnum, OrganisationSettingsNavigationEnum } from 'src/types/enums'

type OrganisationPageProp = {
  userId: string
  organisationId: string
}

const OrganisationAccountTeam = () => {
  const { all: organisations } = useQueryOrganisation()
  const [query, setQuery] = useState('')
  const filteredOrganisaitons = organisations?.filter(
    (x) => x.name.toLowerCase().includes(query.toLowerCase()) && x.type === OrganisationDatabaseEnum.enum.Team
  )
  const session = useSession()

  const getUserRoleInOrganisation = (organisation: Organisation & { members: (OrganisationMember & { user: User })[] }) => {
    return organisation.members.find((x) => x.userId === session?.data?.user?.id)?.type
  }

  return organisations ? (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <span className='text-xl font-semibold'>Your Teams</span>
        <p className='text-xs'>Manage the Teams that you're a part of, join suggested ones, or create a new one.</p>
      </div>
      <input
        onChange={(e) => setQuery(e.target.value)}
        className='text-xs border w-full border-mediumGrey rounded-[5px] p-2'
        placeholder='Search'
      />
      {filteredOrganisaitons && filteredOrganisaitons.length ? (
        <div className='border border-mediumGrey rounded-[5px] divide-y divide-mediumGrey'>
          {filteredOrganisaitons?.map((organisation) => {
            return (
              <div className='p-4 flex flex-row items-center justify-between'>
                <div className='flex flex-row space-y-1 items-center space-x-3'>
                  <div className='h-6 w-6 border rounded-full bg-blueHighlight border-mediumGrey' />
                  <div className='flex flex-col space-y-1'>
                    <span className='text-xs font-bold'>{organisation.name}</span>
                    <span className='text-xs text-darkGrey'>{capitalize(getUserRoleInOrganisation(organisation) || '')}</span>
                  </div>
                </div>
                <Link
                  href={`/${organisation.name}`}
                  className='text-black border border-mediumGrey px-4 py-1.5 rounded-[5px] text-xs'
                >
                  View
                </Link>
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  ) : null
}

const OrganisationAccountDisplayPendingInvites = () => {
  const { pendings } = useQueryOrganisation()
  const session = useSession()
  const { mutate } = trpc.useMutation('organisation.acceptInvitation', {
    onMutate: () => {},
  })
  return (
    <>
      {pendings?.length ? (
        <div className='space-y-6'>
          <div className='space-y-2'>
            <span className='text-xl font-semibold'>Pending Invites</span>
            <p className='text-xs'>Join teams you've been invited to.</p>
            <div className='border border-mediumGrey rounded-[5px] divide-y divide-mediumGrey'>
              {pendings.map((pending) => {
                return (
                  <div className='p-4 flex flex-row items-center justify-between'>
                    <div className='flex flex-row space-y-1 items-center space-x-3'>
                      <div className='h-6 w-6 border rounded-full bg-blueHighlight border-mediumGrey' />
                      <div className='flex flex-col space-y-1'>
                        <span className='text-xs font-bold'>{pending.organisation.name}</span>
                        <span className='text-xs text-darkGrey'>{capitalize(pending.role)}</span>
                      </div>
                    </div>
                    <div className='flex flex-row space-x-2'>
                      {session?.data?.user?.address ? (
                        <>
                          {/* <button className='text-black border border-mediumGrey px-4 py-1.5 rounded-[5px] text-xs'>
                            Decline
                          </button> */}
                          <button
                            onClick={() => {
                              mutate({ organisationId: pending.organisation.id, address: session?.data?.user?.address || '' })
                            }}
                            className='text-white bg-blueHighlight border border-mediumGrey px-4 py-1.5 rounded-[5px] text-xs'
                          >
                            Accept
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

const Page = () => {
  const reset = useRepositoryStore((state) => state.reset)
  const { setOrganisationId, setCurrentSettingsRoute, setCurrentRoute, currentRoute } = useOrganisationNavigationStore(
    (state) => {
      return {
        organisationId: state.organisationId,
        setOrganisationId: state.setOrganisationId,
        setCurrentSettingsRoute: state.setCurrentSettingsRoute,
        setCurrentRoute: state.setCurrentRoute,
        currentRoute: state.currentRoute,
      }
    }
  )
  useEffect(() => {
    setCurrentRoute(OrganisationNavigationEnum.enum.Account)
    setCurrentSettingsRoute(OrganisationSettingsNavigationEnum.enum.Teams)
  }, [])

  const [hasMounted, setHasMounted] = useState(false)
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisations } = useQueryOrganisation()
  const { all: repositories, isLoading: isLoadingRepositories } = useQueryOrganisationsRepository()
  const isLoading = isLoadingOrganisations && isLoadingRepositories

  return (
    <Layout>
      <Layout.Header
        connectButton
        internalRoutes={[
          {
            current: organisation?.name || '',
            href: `/${organisation?.name}`,
            organisations,
          },
        ]}
        internalNavigation={
          organisation?.type === OrganisationDatabaseEnum.enum.Team
            ? [
                {
                  name: OrganisationNavigationEnum.enum.Dashboard,
                  href: `/${organisation?.name}`,
                  enabled: currentRoute === OrganisationNavigationEnum.enum.Dashboard,
                  loading: false,
                },
                {
                  name: OrganisationNavigationEnum.enum.Settings,
                  href: `/${organisation?.name}/${OrganisationNavigationEnum.enum.Settings}`,
                  enabled: currentRoute === OrganisationNavigationEnum.enum.Settings,
                  loading: false,
                },
              ]
            : [
                {
                  name: OrganisationNavigationEnum.enum.Dashboard,
                  href: `/${organisation?.name}`,
                  enabled: currentRoute === OrganisationNavigationEnum.enum.Dashboard,
                  loading: false,
                },
                {
                  name: OrganisationNavigationEnum.enum.Account,
                  href: `/${organisation?.name}/${OrganisationNavigationEnum.enum.Account}`,
                  enabled: currentRoute === OrganisationNavigationEnum.enum.Account,
                  loading: false,
                },
              ]
        }
      />
      <Layout.Body>
        <div className='-ml-4 py-8 space-y-8'>
          {
            <div className='grid grid-cols-10 gap-x-6'>
              <div className='col-span-2'>
                <AccountNavigation />
              </div>
              <div className='col-span-8'>
                <div className='space-y-9'>
                  <OrganisationAccountTeam />
                  <OrganisationAccountDisplayPendingInvites />
                </div>
              </div>
            </div>
          }
        </div>
      </Layout.Body>
    </Layout>
  )
}

export default Page
