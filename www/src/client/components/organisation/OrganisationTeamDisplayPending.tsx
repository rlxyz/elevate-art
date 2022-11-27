import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import clsx from 'clsx'
import { useState } from 'react'
import { useDeepCompareEffect } from 'src/client/hooks/utils/useDeepCompareEffect'
import { getEnsName } from 'src/client/utils/ethers'
import { capitalize } from 'src/client/utils/format'
import { timeAgo } from 'src/client/utils/time'

export const OrganisationTeamDisplayPending = () => {
  const { current: organisation } = useQueryOrganisationFindAll()
  const [pending, setPending] = useState<
    | {
        ens: string | null
        id: string
        address: string
        role: string
        organisationId: string
        createdAt: Date
        updatedAt: Date
      }[]
    | undefined
  >(undefined)
  useDeepCompareEffect(() => {
    const resolveAddress = async () => {
      if (!organisation) return
      return Promise.all(
        organisation.pendings.map(async (x) => {
          return {
            ...x,
            ens: await getEnsName(x.address),
          }
        })
      )
    }
    resolveAddress().then((pending) => {
      setPending(pending)
    })
  }, [organisation])

  return organisation && organisation.pendings.length > 0 ? (
    <div className='space-y-2'>
      <span className='text-xs'>Pending</span>
      <div>
        <div className='w-full px-6 py-2 flex items-center h-[3rem] bg-lightGray text-xs border border-mediumGrey rounded-t-[5px]'>
          <span className='text-darkGrey'>All</span>
        </div>
        <div className='divide-y divide-mediumGrey bg-white border-b border-x rounded-b-[5px] border-mediumGrey'>
          {organisation.pendings.map(({ id, address, role, createdAt }) => (
            <div key={id} className='px-6 py-4 flex justify-between items-center'>
              <div className='flex items-center space-x-2'>
                <div className='border border-mediumGrey rounded-full bg-blueHighlight w-7 h-7' />
                <div className='flex flex-col space-y-1'>
                  <span className='text-xs font-semibold'>{address}</span>
                  <div className={clsx('flex items-baseline')}>
                    <span className='text-xs text-darkGrey'>{createdAt && timeAgo(createdAt)}</span>
                    {/* {ens ? <span className='text-xs font-normal text-blueHighlight'>{ens}</span> : null} */}
                  </div>
                </div>
              </div>
              <span className='text-xs text-darkGrey'>{capitalize(role)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <></>
  )
}
