import { Loading } from '@elevateart/ui'
import { Dialog, Transition } from '@headlessui/react'
import { useMutateOrganisationAcceptInvite } from '@hooks/trpc/organisation/useMutateOrganisationAcceptInvite'
import { Organisation, OrganisationPending } from '@prisma/client'
import { Fragment, useState } from 'react'
import { useNotification } from 'src/client/hooks/utils/useNotification'
import { capitalize } from 'src/client/utils/format'

export const PersonalOrganisationTeamInvitesAcceptDialog = ({
  pending,
}: {
  pending: OrganisationPending & {
    organisation: Organisation
  }
}) => {
  const { notifySuccess } = useNotification()
  const { mutate, isLoading } = useMutateOrganisationAcceptInvite()
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <button onClick={() => setIsOpen(true)} className='text-accents_8 bg-success border border-border px-4 py-1.5 rounded-[5px] text-xs'>
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
            <div className='fixed inset-0 bg-foreground bg-opacity-50' />
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
                <Dialog.Panel className='relative rounded-[5px] border border-accents_8 text-left overflow-hidden shadow-xl transform transition-all sm:max-w-md sm:w-full'>
                  <Dialog.Title
                    as='h3'
                    className='p-8 border-b border-border bg-background text-foreground text-xl justify-center flex leading-6 font-semibold'
                  >
                    Join Team
                  </Dialog.Title>
                  <Dialog.Description>
                    <div className='bg-accents_8 space-y-3 p-8 border-b border-border'>
                      <span className='text-sm'>
                        Collaborate with your team to create a collection. You can add layers, traits, set rules, and generate tons of
                        collections.
                      </span>
                      <div>
                        <div className='space-y-1'>
                          <span className='text-[0.6rem] uppercase'>Name</span>
                          <div className='w-full bg-background text-xs p-2 border border-border rounded-[5px]'>
                            {pending.organisation.name}
                          </div>
                        </div>
                        <div className='space-y-1'>
                          <span className='text-[0.6rem] uppercase'>Role</span>
                          <div className='w-full bg-background text-xs p-2 border border-border rounded-[5px]'>
                            {capitalize(pending.role)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='grid grid-cols-2 bg-background divide-x divide-accents_7'>
                      <button onClick={() => setIsOpen(false)} className='text-xs text-accents_5 py-6 hover:text-foreground'>
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
                        className='text-xs text-accents_5 py-6 hover:text-foreground'
                      >
                        {isLoading ? <Loading /> : 'Join'}
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
