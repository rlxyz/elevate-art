import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { useDeepCompareEffect } from '@hooks/utils/useDeepCompareEffect'
import { OrganisationMember, User } from '@prisma/client'
import { getEnsName } from '@utils/ethers'
import { capitalize } from '@utils/format'
import { timeAgo } from '@utils/time'
import clsx from 'clsx'
import { useState } from 'react'

export const OrganisationTeamDisplayUsers = () => {
  const { current: organisation } = useQueryOrganisation()
  const [allMembers, setAllMembers] = useState<
    | {
        ens: string | null
        id: string
        userId: string
        organisationId: string
        createdAt: Date
        updatedAt: Date
        type: string
        user: User
      }[]
    | undefined
  >(undefined)

  useDeepCompareEffect(() => {
    const resolveAddress = async () => {
      if (!organisation) return
      return Promise.all(
        organisation.members.map(
          async (
            x: OrganisationMember & {
              user: User
            }
          ) => {
            return {
              ...x,
              ens: await getEnsName(x.user.address),
            }
          }
        )
      )
    }
    resolveAddress().then((pending) => {
      setAllMembers(pending)
    })
  }, [organisation])

  return organisation && organisation.members.length > 0 ? (
    <div className='space-y-2'>
      <span className='text-xs'>Team Members</span>
      <div>
        <div className='w-full px-6 py-2 flex items-center h-[3rem] bg-accents_8 text-xs border border-border rounded-t-[5px]'>
          <span className='text-accents_5'>All</span>
        </div>
        <div className='divide-y divide-accents_7 bg-background border-b border-x rounded-b-[5px] border-border'>
          {organisation.members.map(({ id, user: { address }, createdAt, type }) => (
            <div key={id} className='px-6 py-4 flex justify-between items-center'>
              <div className='flex items-center space-x-2'>
                <div className='border border-border rounded-full bg-success w-7 h-7' />
                <div className='flex flex-col space-y-1'>
                  <span className='text-xs font-semibold'>{address}</span>
                  <div className={clsx('flex items-baseline')}>
                    <span className='text-xs text-accents_5'>{createdAt && timeAgo(createdAt)}</span>
                  </div>
                </div>
              </div>
              <span className='text-xs text-accents_5'>{capitalize(type)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <></>
  )
}
