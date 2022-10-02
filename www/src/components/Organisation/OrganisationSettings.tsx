import { Link } from '@components/Layout/Link'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import { capitalize } from '@utils/format'
import { timeAgo } from '@utils/time'
import { trpc } from '@utils/trpc'
import { ethers } from 'ethers'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { OrganisationDatabaseRoleEnum, OrganisationNavigationEnum, OrganisationSettingsNavigationEnum } from 'src/types/enums'

export const SettingsNavigations = () => {
  const { current: organisation } = useQueryOrganisation()
  const currentSettingsRoute = useOrganisationNavigationStore((state) => state.currentSettingsRoute)
  return (
    <div>
      {[
        {
          name: OrganisationSettingsNavigationEnum.enum.General,
          href: `/${organisation?.name}/${OrganisationNavigationEnum.enum.Settings}`,
        },
        {
          name: OrganisationSettingsNavigationEnum.enum.Team,
          href: `/${organisation?.name}/${OrganisationNavigationEnum.enum.Settings}/${OrganisationSettingsNavigationEnum.enum.Team}`,
        },
      ].map(({ name, href }) => {
        return <Link key={name} href={href} title={capitalize(name)} enabled={currentSettingsRoute === name} />
      })}
    </div>
  )
}

export const AccountNavigation = () => {
  const { current: organisation } = useQueryOrganisation()
  const currentSettingsRoute = useOrganisationNavigationStore((state) => state.currentSettingsRoute)
  return (
    <div>
      {[
        {
          name: OrganisationSettingsNavigationEnum.enum.General,
          href: `/${organisation?.name}/${OrganisationNavigationEnum.enum.Account}`,
        },
        {
          name: OrganisationSettingsNavigationEnum.enum.Teams,
          href: `/${organisation?.name}/${OrganisationNavigationEnum.enum.Account}/${OrganisationSettingsNavigationEnum.enum.Teams}`,
        },
      ].map(({ name, href }) => {
        return <Link key={name} href={href} title={capitalize(name)} enabled={currentSettingsRoute === name} />
      })}
    </div>
  )
}

export const OrganisationGeneralSettings = () => {
  const { current: organisation } = useQueryOrganisation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  return (
    <form
      onSubmit={handleSubmit((data) => {
        console.log(data)
      })}
    >
      <div className='w-full rounded-[5px] border border-mediumGrey'>
        <div className='p-6 space-y-4'>
          <div className='flex flex-col'>
            <div className='col-span-6 font-plus-jakarta-sans space-y-2'>
              <h1 className='text-lg font-semibold text-black'>Team Name</h1>
              <p className='text-xs text-black'>{'Used to identify your teams name on elevate.art'}</p>
            </div>
          </div>
          <div className='w-full border border-mediumGrey rounded-[5px]'>
            <div className='h-full grid grid-cols-10 text-sm'>
              <div className='col-span-4 border-r border-r-mediumGrey rounded-l-[5px] bg-lightGray text-darkGrey flex items-center'>
                <span className='px-4 py-2'>{`elevate.art/`}</span>
              </div>
              <div className='col-span-6 flex items-center'>
                {/* <input
                  className='text-xs px-2 w-full h-full rounded-[5px]'
                  defaultValue={organisation?.name || ''}
                  type='string'
                  {...register('name', { required: true, maxLength: 20, minLength: 3, pattern: /^[-/a-z0-9]+$/gi })}
                /> */}
                <span className='text-xs px-2 w-full h-full items-center flex rounded-[5px]'>{organisation?.name}</span>
              </div>
            </div>
          </div>
        </div>
        <footer className='w-full p-6 flex items-center h-[3rem] bg-lightGray text-xs justify-end border-t border-t-mediumGrey'>
          {/* <div className='flex items-center'>
            <span>{`Learn more about`}&nbsp;</span>
            <Link href='https://docs.elevate.art/team'>
            <div className='flex items-center text-blueHighlight'>
              <span>{'Team Name'}</span>
              <ArrowTopRightOnSquare className='w-3 h-3' />
            </div>
            </Link>
          </div> */}
          <div>
            <div className='border border-mediumGrey px-4 py-2 rounded-[5px]'>
              <span className='text-darkGrey'>Save</span>
            </div>
          </div>
        </footer>
      </div>
    </form>
  )
}

export const OrganisationTeamAddUser = () => {
  const { current: organisation } = useQueryOrganisation()
  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const { mutate } = trpc.useMutation('organisation.addUser', {
    onMutate: () => {
      clearErrors('exists')
    },
    onSuccess: () => {
      reset()
    },
    onError: () => {
      setError('exists', { type: 'manual', message: 'Something went wrong, possibly the address is already added' })
    },
  })

  return organisation ? (
    <form
      onSubmit={handleSubmit((data) => {
        mutate({
          address: data.address,
          organisationId: organisation?.id,
          role: data.role,
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
                <p className='py-3 text-xs text-black'>Add Team Members using Ethereum address.</p>
              </div>
            </div>
            <div className='h-full grid grid-cols-10 gap-x-2 text-sm'>
              <div className='col-span-7 space-y-1'>
                <label className='text-[0.7rem] uppercase'>Ethereum Address</label>
                <div className='w-full'>
                  <div className='flex items-center border border-mediumGrey rounded-[5px]'>
                    <input
                      className='text-xs p-2 w-full h-full rounded-[5px]'
                      // defaultValue={organisation?.name || ''}
                      type='string'
                      placeholder='0xd2a08007eeeaf1f81eeF54Ba6A8c4Effa1e545C6'
                      {...register('address', {
                        required: true,
                        validate: (v) => ethers.utils.isAddress(v),
                        onChange: () => {
                          clearErrors('exists')
                        },
                      })}
                    />
                  </div>
                </div>
              </div>
              <div className='col-span-3 space-y-1'>
                <label className='text-[0.7rem] uppercase'>Role</label>
                <div className='w-full'>
                  <select
                    {...register('role', { required: true })}
                    className='text-xs p-2 w-full h-full rounded-[5px] border border-mediumGrey'
                  >
                    <option value={OrganisationDatabaseRoleEnum.enum.Admin}>
                      {capitalize(OrganisationDatabaseRoleEnum.enum.Admin)}
                    </option>
                    <option value={OrganisationDatabaseRoleEnum.enum.Curator}>
                      {capitalize(OrganisationDatabaseRoleEnum.enum.Curator)}
                    </option>
                  </select>
                </div>
              </div>
              {errors.address ? (
                <span className='mt-2 col-span-10 text-xs w-full text-redError flex items-center space-x-1'>
                  <ExclamationCircleIcon className='text-redError w-4 h-4' />
                  <span>Please add a valid Ethereum address</span>
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
            <button
              type='submit'
              className='bg-blueHighlight text-white disabled:bg-lightGray disabled:text-darkGrey border border-mediumGrey px-4 py-1.5 rounded-[5px]'
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </form>
  ) : (
    <></>
  )
}

export const OrganisationTeamDisplayUsers = () => {
  const { current: organisation } = useQueryOrganisation()
  const session = useSession()
  return (
    <div>
      <div className='w-full px-6 py-2 flex items-center h-[3rem] bg-lightGray text-xs border border-mediumGrey rounded-t-[5px]'>
        <span className='text-darkGrey'>All</span>
      </div>
      <div className='divide-y divide-mediumGrey bg-white border-b border-x rounded-b-[5px] border-mediumGrey'>
        {organisation?.members.map(({ id, user: { address }, createdAt, type }) => (
          <div key={id} className='px-6 py-4 flex justify-between items-center'>
            <div className='flex items-center space-x-2'>
              <div className='border border-mediumGrey rounded-full bg-blueHighlight w-7 h-7' />
              <div className='flex flex-col space-y-1'>
                <span className='text-xs font-semibold'>{address}</span>
                <span className='text-xs text-darkGrey'>{timeAgo(createdAt)}</span>
              </div>
            </div>
            <span className='text-xs text-darkGrey'>{capitalize(type)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export const OrganisationTeamDisplayPending = () => {
  const { current: organisation } = useQueryOrganisation()
  return (
    <div>
      <div className='w-full px-6 py-2 flex items-center h-[3rem] bg-lightGray text-xs border border-mediumGrey rounded-t-[5px]'>
        <span className='text-darkGrey'>All</span>
      </div>
      <div className='divide-y divide-mediumGrey bg-white border-b border-x rounded-b-[5px] border-mediumGrey'>
        {organisation?.pendings.map(({ id, address, role, createdAt }) => (
          <div key={id} className='px-6 py-4 flex justify-between items-center'>
            <div className='flex items-center space-x-2'>
              <div className='border border-mediumGrey rounded-full bg-blueHighlight w-7 h-7' />
              <div className='flex flex-col space-y-1'>
                <span className='text-xs font-semibold'>{address}</span>
                <span className='text-xs text-darkGrey'>{createdAt && timeAgo(createdAt)}</span>
              </div>
            </div>
            <span className='text-xs text-darkGrey'>{capitalize(role)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
