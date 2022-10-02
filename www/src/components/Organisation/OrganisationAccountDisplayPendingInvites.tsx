import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { capitalize } from '@utils/format'
import { useSession } from 'next-auth/react'
import { useMutateAcceptInvitation } from '../../hooks/mutations/useMutateAcceptInvitation'

export const OrganisationAccountDisplayPendingInvites = () => {
  const { pendings } = useQueryOrganisation()
  const session = useSession()
  const { mutate } = useMutateAcceptInvitation()
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
                              mutate({ pendingId: pending.id })
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
