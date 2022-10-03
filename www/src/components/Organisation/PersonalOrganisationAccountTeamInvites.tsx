import Loader from '@components/Layout/Loader'
import { Dialog, Transition } from '@headlessui/react'
import { useMutateAcceptInvitation } from '@hooks/mutations/useMutateAcceptInvitation'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { useNotification } from '@hooks/utils/useNotification'
import { Organisation, OrganisationPending } from '@prisma/client'
import { capitalize } from '@utils/format'
import { useSession } from 'next-auth/react'
import { Fragment, useState } from 'react'

const AcceptPendingInvite = ({
  pending,
}: {
  pending: OrganisationPending & {
    organisation: Organisation
  }
}) => {
  const { notifySuccess } = useNotification()
  const { mutate, isLoading } = useMutateAcceptInvitation()
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='text-white bg-blueHighlight border border-mediumGrey px-4 py-1.5 rounded-[5px] text-xs'
      >
        Accept
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-50' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <Dialog.Panel className='relative rounded-[5px] border border-lightGray text-left overflow-hidden shadow-xl transform transition-all sm:max-w-md sm:w-full'>
                  <Dialog.Title
                    as='h3'
                    className='p-8 border-b border-mediumGrey bg-white text-black text-xl justify-center flex leading-6 font-semibold'
                  >
                    Join Team
                  </Dialog.Title>
                  <Dialog.Description>
                    <div className='bg-lightGray space-y-3 p-8 border-b border-mediumGrey'>
                      <span className='text-sm'>
                        Collaborate with your team to create a collection. You can add layers, traits, set rules, and generate
                        tons of collections.
                      </span>
                      <div>
                        <div className='space-y-1'>
                          <span className='text-[0.6rem] uppercase'>Name</span>
                          <div className='w-full bg-white text-xs p-2 border border-mediumGrey rounded-[5px]'>
                            {pending.organisation.name}
                          </div>
                        </div>
                        <div className='space-y-1'>
                          <span className='text-[0.6rem] uppercase'>Role</span>
                          <div className='w-full bg-white text-xs p-2 border border-mediumGrey rounded-[5px]'>
                            {capitalize(pending.role)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='grid grid-cols-2 bg-white divide-x divide-mediumGrey'>
                      <button onClick={() => setIsOpen(false)} className='text-xs text-darkGrey py-6 hover:text-black'>
                        Cancel
                      </button>
                      <button
                        onClick={() =>
                          mutate(
                            {
                              pendingId: pending.id,
                            },
                            {
                              onSuccess: () => {
                                notifySuccess('You have successfully joined the team')
                                setIsOpen(false)
                              },
                            }
                          )
                        }
                        className='text-xs text-darkGrey py-6 hover:text-black'
                      >
                        {isLoading ? <Loader /> : 'Join'}
                      </button>
                    </div>
                  </Dialog.Description>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

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
              <p>Join teams you've been invited to.</p>
            </div>
          </div>
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
                    {session?.data?.user?.address ? <AcceptPendingInvite pending={pending} /> : null}
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
