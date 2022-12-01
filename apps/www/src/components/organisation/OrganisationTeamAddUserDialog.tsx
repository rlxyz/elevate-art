import { OrganisationDatabaseRoleEnumType } from "@elevateart/db/enums";
import { Loading, useNotification } from "@elevateart/ui";
import { Dialog, Transition } from "@headlessui/react";
import { useMutateOrganisationSendInvite } from "@hooks/trpc/organisation/useMutateOrganisationSendInvite";
import { Fragment } from "react";
import { capitalize } from "src/utils/format";

export const OrganisationTeamAddUserDialog = ({
  organisationId,
  addNewUserData,
  isOpen,
  onClose,
}: {
  organisationId: string;
  addNewUserData: { address: string; role: OrganisationDatabaseRoleEnumType };
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { notifySuccess, notifyError } = useNotification();
  const { mutate, isLoading } = useMutateOrganisationSendInvite();
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-foreground bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-[5px] border border-accents_8 text-left shadow-xl transition-all sm:w-full sm:max-w-md">
                  <Dialog.Title
                    as="h3"
                    className="flex justify-center border-b border-border bg-background p-8 text-xl font-semibold leading-6 text-foreground"
                  >
                    Add Collaborator
                  </Dialog.Title>
                  <Dialog.Description>
                    <div className="space-y-3 border-b border-border bg-accents_8 p-8">
                      <span className="text-sm">
                        Add people to your team and collaborate with them. They can create projects, add layers with associates traits, set
                        rarity, create rules, and generate collections.
                      </span>
                      <div>
                        <div className="space-y-1">
                          <span className="text-[0.6rem] uppercase">Address</span>
                          <div className="bg-white border-mediumGrey w-full rounded-[5px] border p-2 text-xs">{addNewUserData.address}</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[0.6rem] uppercase">Role</span>
                          <div className="w-full rounded-[5px] border border-border bg-background p-2 text-xs">
                            {capitalize(addNewUserData.role || "")}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-accents_7 bg-background">
                      <button onClick={onClose} className="py-6 text-xs text-accents_5 hover:bg-accents_8">
                        Cancel
                      </button>
                      <button
                        disabled={isLoading}
                        onClick={(e) => {
                          e.preventDefault();
                          mutate(
                            {
                              organisationId,
                              address: addNewUserData.address,
                              role: addNewUserData.role,
                            },
                            {
                              onSuccess: () => {
                                notifySuccess(`Added a new member to the team`);
                                onClose();
                              },
                              onError: () => {
                                notifyError("Couldn't add a new member to the team");
                                onClose();
                              },
                            },
                          );
                        }}
                        className="py-6 text-xs text-success hover:bg-accents_8"
                      >
                        {isLoading ? <Loading /> : "Add"}
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
  );
};
