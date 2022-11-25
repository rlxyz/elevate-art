import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { capitalize } from '@utils/format'
import { useSession } from 'next-auth/react'
import { PersonalOrganisationTeamInvitesAcceptDialog } from './PersonalOrganisationTeamInvitesAcceptDialog'

export const PersonalOrganisationAccountTeamInvites = () => {
  const { pendings } = useQueryOrganisation()
  const session = useSession()
  return (
    <>
      {pendings?.length ? (
        <div className='space-y-6'>
          <div className='space-y-2'>
            <span className='text-xl font-semibold'>
              <span>Pending Invites</span>
            </span>
            <div className={'text-xs text-darkGrey'}>
              <p>Join teams youve been invited to</p>
            </div>
          </div>
          <div className='border border-mediumGrey rounded-[5px] divide-y divide-mediumGrey'>
            {pendings.map((pending) => {
              return (
                <div key={pending.id} className='p-4 flex flex-row items-center justify-between'>
                  <div className='flex flex-row space-y-1 items-center space-x-3'>
                    <div className='h-6 w-6 border rounded-full bg-blueHighlight border-mediumGrey' />
                    <div className='flex flex-col space-y-1'>
                      <span className='text-xs font-bold'>{pending.organisation.name}</span>
                      <span className='text-xs text-darkGrey'>{capitalize(pending.role)}</span>
                    </div>
                  </div>
                  <div className='flex flex-row space-x-2'>
                    {session?.data?.user?.address ? <PersonalOrganisationTeamInvitesAcceptDialog pending={pending} /> : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </>
  )
}
