import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { useDeepCompareEffect } from '@hooks/utils/useDeepCompareEffect'
import { getEnsName } from '@utils/ethers'
import { capitalize } from '@utils/format'
import { timeAgo } from '@utils/time'
import clsx from 'clsx'
import { useState } from 'react'

export const OrganisationTeamDisplayPending = () => {
  const { current: organisation } = useQueryOrganisation()
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
        <div className='w-full px-6 py-2 flex items-center h-[3rem] bg-accents_8 text-xs border border-border rounded-t-[5px]'>
          <span className='text-accents_5'>All</span>
        </div>
        <div className='divide-y divide-accents_7 bg-white border-b border-x rounded-b-[5px] border-border'>
          {organisation.pendings.map(({ id, address, role, createdAt }) => (
            <div key={id} className='px-6 py-4 flex justify-between items-center'>
              <div className='flex items-center space-x-2'>
                <div className='border border-border rounded-full bg-success w-7 h-7' />
                <div className='flex flex-col space-y-1'>
                  <span className='text-xs font-semibold'>{address}</span>
                  <div className={clsx('flex items-baseline')}>
                    <span className='text-xs text-accents_5'>{createdAt && timeAgo(createdAt)}</span>
                    {/* {ens ? <span className='text-xs font-normal text-success'>{ens}</span> : null} */}
                  </div>
                </div>
              </div>
              <span className='text-xs text-accents_5'>{capitalize(role)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <></>
  )
}
