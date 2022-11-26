import LoadingComponent from '@components/layout/loading/Loading'
import { Dialog, Transition } from '@headlessui/react'
import { useMutateOrganisationAddUser } from '@hooks/mutations/useMutateOrganisationAddUser'
import { useNotification } from '@hooks/utils/useNotification'
import { capitalize } from '@utils/format'
import { Fragment } from 'react'
import { OrganisationDatabaseRoleEnumType } from 'src/types/enums'

export const OrganisationTeamAddUserDialog = ({
  organisationId,
  addNewUserData,
  isOpen,
  onClose,
}: {
  organisationId: string
  addNewUserData: { address: string; role: OrganisationDatabaseRoleEnumType }
  isOpen: boolean
  onClose: () => void
}) => {
  const { notifySuccess, notifyError } = useNotification()
  const { mutate, isLoading } = useMutateOrganisationAddUser()
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={onClose}>
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
                    Add Collaborator
                  </Dialog.Title>
                  <Dialog.Description>
                    <div className='bg-lightGray space-y-3 p-8 border-b border-mediumGrey'>
                      <span className='text-sm'>
                        Add people to your team and collaborate with them. They can create projects, add layers with associates traits, set
                        rarity, create rules, and generate collections.
                      </span>
                      <div>
                        <div className='space-y-1'>
                          <span className='text-[0.6rem] uppercase'>Address</span>
                          <div className='w-full bg-white text-xs p-2 border border-mediumGrey rounded-[5px]'>{addNewUserData.address}</div>
                        </div>
                        <div className='space-y-1'>
                          <span className='text-[0.6rem] uppercase'>Role</span>
                          <div className='w-full bg-white text-xs p-2 border border-mediumGrey rounded-[5px]'>
                            {capitalize(addNewUserData.role || '')}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='grid grid-cols-2 bg-white divide-x divide-mediumGrey'>
                      <button onClick={onClose} className='text-xs text-darkGrey hover:bg-lightGray py-6'>
                        Cancel
                      </button>
                      <button
                        disabled={isLoading}
                        onClick={(e) => {
                          e.preventDefault()
                          mutate(
                            {
                              organisationId,
                              address: addNewUserData.address,
                              role: addNewUserData.role,
                            },
                            {
                              onSuccess: () => {
                                notifySuccess(`Added a new member to the team`)
                                onClose()
                              },
                              onError: () => {
                                notifyError("Couldn't add a new member to the team")
                                onClose()
                              },
                            }
                          )
                        }}
                        className='text-xs text-blueHighlight hover:bg-lightGray py-6'
                      >
                        {isLoading ? <LoadingComponent /> : 'Add'}
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
