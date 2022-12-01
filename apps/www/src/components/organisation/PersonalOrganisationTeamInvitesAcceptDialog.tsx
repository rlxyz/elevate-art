import { Loading } from "@elevateart/ui";
import { Dialog, Transition } from "@headlessui/react";
import { Organisation, OrganisationPending } from "@prisma/client";
import { Fragment, useState } from "react";
import { capitalize } from "src/client/utils/format";
import { useMutateOrganisationAcceptInvite } from "src/hooks/trpc/organisation/useMutateOrganisationAcceptInvite";
import { useNotification } from "src/hooks/utils/useNotification";

export const PersonalOrganisationTeamInvitesAcceptDialog = ({
  pending,
}: {
  pending: OrganisationPending & {
    organisation: Organisation;
  };
}) => {
  const { notifySuccess } = useNotification();
  const { mutate, isLoading } = useMutateOrganisationAcceptInvite();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-[5px] border border-border bg-success px-4 py-1.5 text-xs text-accents_8"
      >
        Accept
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
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
                    Join Team
                  </Dialog.Title>
                  <Dialog.Description>
                    <div className="space-y-3 border-b border-border bg-accents_8 p-8">
                      <span className="text-sm">
                        Collaborate with your team to create a collection. You
                        can add layers, traits, set rules, and generate tons of
                        collections.
                      </span>
                      <div>
                        <div className="space-y-1">
                          <span className="text-[0.6rem] uppercase">Name</span>
                          <div className="w-full rounded-[5px] border border-border bg-background p-2 text-xs">
                            {pending.organisation.name}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[0.6rem] uppercase">Role</span>
                          <div className="w-full rounded-[5px] border border-border bg-background p-2 text-xs">
                            {capitalize(pending.role)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-accents_7 bg-background">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="py-6 text-xs text-accents_5 hover:text-foreground"
                      >
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
                                notifySuccess(
                                  "You have successfully joined the team",
                                );
                                setIsOpen(false);
                              },
                            },
                          )
                        }
                        className="py-6 text-xs text-accents_5 hover:text-foreground"
                      >
                        {isLoading ? <Loading /> : "Join"}
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
