import { Link } from '@components/Layout/Link'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { Organisation, OrganisationMember, User } from '@prisma/client'
import { capitalize } from '@utils/format'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { OrganisationDatabaseEnum } from 'src/types/enums'

export const OrganisationAccountTeam = () => {
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
