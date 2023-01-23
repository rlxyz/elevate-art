import { ExclamationCircleIcon } from '@heroicons/react/outline'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import clsx from 'clsx'
import { ethers } from 'ethers'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { getAddressFromEns } from 'src/client/utils/ethers'
import { capitalize } from 'src/client/utils/format'
import type { OrganisationDatabaseRoleEnumType } from 'src/shared/enums'
import { OrganisationDatabaseRoleEnum } from 'src/shared/enums'
import { OrganisationTeamAddUserDialog } from './OrganisationTeamAddUserDialog'
export const OrganisationTeamAddUser = () => {
  const { current: organisation } = useQueryOrganisationFindAll()
  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const [addNewUserData, setAddNewUserData] = useState<{ address: string; role: OrganisationDatabaseRoleEnumType } | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  return organisation ? (
    <form
      onSubmit={handleSubmit(async (data) => {
        let address: string | null
        if (String(data.address).endsWith('.eth')) {
          address = await getAddressFromEns(data.address)
          if (!address) {
            setError('address', { type: 'manual', message: 'Address not found' })
            return
          }
        } else {
          address = data.address
        }

        if (!address) return

        // validate address not in member or pending list
        const isMember = organisation.members.find((member) => member.user.address === address)
        if (isMember) {
          setError('address', { type: 'manual', message: 'Address already in member list' })
          return
        }

        const isPendingMember = organisation.pendings.find((pending) => pending.address === address)
        if (isPendingMember) {
          setError('address', { type: 'manual', message: 'Address already in pending list' })
          return
        }

        setIsOpen(true)
        setAddNewUserData({
          address,
          role:
            data.role === OrganisationDatabaseRoleEnum.enum.Admin
              ? OrganisationDatabaseRoleEnum.enum.Admin
              : OrganisationDatabaseRoleEnum.enum.Curator, // ensure typesafety
        })
      })}
    >
      <div className='flex space-y-6 flex-col'>
        <div className='flex flex-col space-y-2'>
          <h1 className='text-lg font-semibold text-black'>Members</h1>
          <p className='text-xs text-black'>Manage and invite Team Members.</p>
        </div>
        <div className='w-full rounded-[5px] border border-mediumGrey'>
          <div className='p-6 space-y-2'>
            <div className='flex flex-col'>
              <div className='col-span-6 font-plus-jakarta-sans divide-y divide-mediumGrey space-y-3'>
                <h1 className='text-sm font-semibold text-black'>Add new</h1>
                <p className='py-3 text-xs text-black'>Add Team Members using Ethereum address or ENS.</p>
              </div>
            </div>
            <div className='h-full grid grid-cols-10 gap-x-2 text-sm'>
              <div className='col-span-7 space-y-1'>
                <label className='text-[0.7rem] uppercase'>Ethereum Address</label>
                <div className='w-full'>
                  <input
                    className={clsx(
                      'text-xs p-2 w-full h-full border border-mediumGrey rounded-[5px]',
                      'invalid:border-redError invalid:text-redError',
                      'focus:invalid:border-redError focus:invalid:ring-redError',
                      'focus:outline-none focus:ring-1 focus:border-blueHighlight focus:ring-blueHighlight'
                    )}
                    aria-invalid={errors.address ? 'true' : 'false'}
                    placeholder='0xd2a420... or alpha.eth...'
                    {...register('address', {
                      required: true,
                      validate: async (v) => {
                        if (String(v).endsWith('.eth')) {
                          const address = await getAddressFromEns(v)
                          if (!address) return false
                          return ethers.utils.isAddress(address)
                        }
                        return ethers.utils.isAddress(v)
                      },
                    })}
                  />
                </div>
              </div>
              <div className='col-span-3 space-y-1'>
                <label className='text-[0.7rem] uppercase'>Role</label>
                <div className='w-full'>
                  <select
                    {...register('role', { required: true })}
                    className='text-xs p-2 w-full h-full rounded-[5px] border border-mediumGrey'
                  >
                    <option value={OrganisationDatabaseRoleEnum.enum.Admin}>{capitalize(OrganisationDatabaseRoleEnum.enum.Admin)}</option>
                    <option value={OrganisationDatabaseRoleEnum.enum.Curator}>
                      {capitalize(OrganisationDatabaseRoleEnum.enum.Curator)}
                    </option>
                  </select>
                </div>
              </div>
              {errors.address ? (
                <span className='mt-2 col-span-10 text-xs w-full text-redError flex items-center space-x-1'>
                  <ExclamationCircleIcon className='text-redError w-4 h-4' />
                  <span>{String(errors?.address?.message) || 'Please enter a valid Ethereum address'}</span>
                </span>
              ) : null}
              {errors.role ? (
                <span className='mt-2 col-span-10 text-xs w-full text-redError flex items-center space-x-1'>
                  <ExclamationCircleIcon className='text-redError w-4 h-4' />
                  <span>Please choose a role for this address</span>
                </span>
              ) : null}
              {errors.exists ? (
                <>
                  <span className='mt-2 col-span-10 text-xs w-full text-redError flex items-center space-x-1'>
                    <ExclamationCircleIcon className='text-redError w-4 h-4' />
                    <span>Something went wrong, possibly the address is already added</span>
                  </span>
                </>
              ) : null}
            </div>
          </div>
          <div className='w-full px-6 py-2 flex items-center bg-lightGray text-xs  justify-end border-t border-t-mediumGrey'>
            <button className='bg-blueHighlight text-white disabled:bg-lightGray disabled:text-darkGrey border border-mediumGrey px-4 py-1.5 rounded-[5px]'>
              Add
            </button>
            {addNewUserData && (
              <OrganisationTeamAddUserDialog
                organisationId={organisation.id}
                addNewUserData={addNewUserData}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
    </form>
  ) : (
    <></>
  )
}
