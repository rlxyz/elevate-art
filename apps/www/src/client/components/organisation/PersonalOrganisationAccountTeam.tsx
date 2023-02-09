import NextLinkComponent from '@components/layout/link/NextLink'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import type { Organisation, OrganisationMember, User } from '@prisma/client'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import AvatarComponent from 'src/client/components/layout/avatar/Avatar'
import SearchInput from 'src/client/components/layout/search/Search'
import { capitalize, routeBuilder } from 'src/client/utils/format'
import { OrganisationDatabaseEnum, ZoneNavigationEnum } from 'src/shared/enums'
import OrganisationCreateTeamModal from './OrganisationCreateTeamModal'
import { OrganisationMenuNavigation } from './OrganisationMenuNavigation'

export const PersonalOrganisationAccountTeam = () => {
  const { all: organisations } = useQueryOrganisationFindAll()
  const [query, setQuery] = useState('')
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false)
  const filteredOrganisaitons = organisations?.filter((x) => x.name.toLowerCase().includes(query.toLowerCase()))
  const session = useSession()

  const getUserRoleInOrganisation = (organisation: Organisation & { members: (OrganisationMember & { user: User })[] }) => {
    return organisation.members.find((x) => x.userId === session?.data?.user?.id)?.type
  }

  const isLoading = !organisations

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <span className={clsx(isLoading && 'bg-mediumGrey bg-opacity-50 animate-pulse rounded-[5px]', 'text-xl font-semibold')}>
          <span className={clsx(isLoading && 'invisible')}>Your Teams</span>
        </span>
        <div className={clsx(isLoading && 'bg-mediumGrey bg-opacity-50 animate-pulse rounded-[5px] w-1/4', 'text-xs text-darkGrey')}>
          <p className={clsx(isLoading && 'invisible')}>View the Teams that youre a part of</p>
        </div>
      </div>
      <div className='grid grid-cols-7 space-x-3 items-center'>
        <div className='col-span-6 h-full w-full'>
          <SearchInput
            isLoading={isLoading}
            onChange={(e) => {
              e.preventDefault()
              setQuery(e.target.value)
            }}
          />
        </div>

        <div className='col-span-1 h-full flex items-center'>
          <div className={clsx(isLoading && 'bg-mediumGrey bg-opacity-50 animate-pulse rounded-[5px]', 'h-full w-full')}>
            <button
              className={clsx(isLoading && 'invisible', 'w-full border h-full rounded-[5px] text-xs text-white bg-black')}
              onClick={(e: any) => {
                e.preventDefault()

                setIsCreateTeamOpen(true)
              }}
            >
              Create Team
            </button>
          </div>
        </div>
      </div>
      <OrganisationCreateTeamModal visible={isCreateTeamOpen} onClose={() => setIsCreateTeamOpen(false)} />

      {filteredOrganisaitons && filteredOrganisaitons?.length > 0 ? (
        <>
          <div className={clsx(organisations && 'border border-mediumGrey', 'rounded-[5px] divide-y divide-mediumGrey')}>
            {filteredOrganisaitons.map((organisation) => (
              <div key={organisation.id} className='p-4 flex flex-row items-center justify-between'>
                <div className='flex flex-row space-y-1 items-center space-x-3'>
                  <AvatarComponent src='/images/avatar-blank.png' />
                  <div className='flex flex-col space-y-1'>
                    <span className='text-xs font-bold'>{organisation.name}</span>
                    <span className='text-xs text-darkGrey'>
                      {organisation.type === OrganisationDatabaseEnum.enum.Personal
                        ? capitalize(OrganisationDatabaseEnum.enum.Personal)
                        : capitalize(getUserRoleInOrganisation(organisation) || '')}
                    </span>
                  </div>
                </div>
                <div className='flex flex-row-reverse space-x-3'>
                  <OrganisationMenuNavigation organisation={organisation} />
                  <NextLinkComponent href={routeBuilder(organisation.name, ZoneNavigationEnum.enum.Create)} className='w-fit'>
                    <span className='text-white bg-blueHighlight px-4 py-1.5 rounded-[5px] text-xs w-fit'>Admin</span>
                  </NextLinkComponent>
                  <NextLinkComponent href={routeBuilder(organisation.name)} className='w-fit'>
                    <span className='text-black border border-mediumGrey px-4 py-1.5 rounded-[5px] text-xs w-fit'>View</span>
                  </NextLinkComponent>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <></>
      )}
      {isLoading ? (
        <div className={clsx(organisations && 'border border-mediumGrey', 'rounded-[5px] divide-y divide-mediumGrey')}>
          {Array.from(Array(3).keys()).map((index) => {
            return (
              <div
                key={index}
                className={clsx(
                  isLoading && 'bg-mediumGrey bg-opacity-50 animate-pulse rounded-[5px]',
                  'p-4 flex flex-row items-center justify-between'
                )}
              >
                <div className={clsx(!'flex flex-row space-y-1 items-center space-x-3 invisible')}>
                  <div className='h-6 w-6 rounded-full' />
                  <div className='flex flex-col space-y-1'>
                    <span className='text-xs font-bold'>{''}</span>
                    <span className='text-xs text-darkGrey'>{''}</span>
                  </div>
                </div>
                <div />
              </div>
            )
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}
