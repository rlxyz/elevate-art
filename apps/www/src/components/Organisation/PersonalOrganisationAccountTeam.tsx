import { Link } from '@components/Layout/Link'
import { OrganisationDatabaseEnum } from '@elevateart/db/enums'
import { useSession } from '@elevateart/eth-auth'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { Organisation, OrganisationMember, User } from '@prisma/client'
import { capitalize } from '@utils/format'
import clsx from 'clsx'
import { useState } from 'react'
import { SearchInput } from '../Layout/SearchInput'

export const PersonalOrganisationAccountTeam = () => {
  const { all: organisations } = useQueryOrganisation()
  const [query, setQuery] = useState('')
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
        <div
          className={clsx(isLoading && 'bg-mediumGrey bg-opacity-50 animate-pulse rounded-[5px] w-1/4', 'text-xs text-darkGrey')}
        >
          <p className={clsx(isLoading && 'invisible')}>View the Teams that youre a part of</p>
        </div>
      </div>
      <SearchInput isLoading={isLoading} setQuery={setQuery} />
      {filteredOrganisaitons && filteredOrganisaitons?.length > 0 ? (
        <>
          <div className={clsx(organisations && 'border border-mediumGrey', 'rounded-[5px] divide-y divide-mediumGrey')}>
            {filteredOrganisaitons.map((organisation) => {
              return (
                <div key={organisation.id} className='p-4 flex flex-row items-center justify-between'>
                  <div className='flex flex-row space-y-1 items-center space-x-3'>
                    <div className='h-6 w-6 border rounded-full bg-blueHighlight border-mediumGrey' />
                    <div className='flex flex-col space-y-1'>
                      <span className='text-xs font-bold'>
                        {organisation.type === OrganisationDatabaseEnum.enum.Personal
                          ? capitalize(organisation.name)
                          : organisation.name}
                      </span>
                      <span className='text-xs text-darkGrey'>
                        {organisation.type === OrganisationDatabaseEnum.enum.Personal
                          ? capitalize(OrganisationDatabaseEnum.enum.Personal)
                          : capitalize(getUserRoleInOrganisation(organisation) || '')}
                      </span>
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
