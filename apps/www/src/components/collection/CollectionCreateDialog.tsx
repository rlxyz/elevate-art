import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useForm } from "react-hook-form";
import useRepositoryStore from "src/client/hooks/store/useRepositoryStore";
import Button from "src/componensrc/hooks/store/useRepositoryStore";
import { useMutateCollectionCreate } from "../../hooks/trpc/collection/useMutateCollectionCreate";

const Index = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { mutate: createCollection } = useMutateCollectionCreate({
    onMutate: onClose,
  });
  const repositoryId = useRepositoryStore((state) => state.repositoryId);

  return (
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
              <Dialog.Panel className="relative transform space-y-6 divide-y divide-accents_8 overflow-hidden rounded-[5px] border border-accents_8 bg-background p-8 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="space-y-4">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold leading-6"
                  >
                    Create new collection
                  </Dialog.Title>
                  <form
                    onSubmit={handleSubmit((data) => {
                      createCollection({
                        name: data.name,
                        repositoryId,
                        totalSupply: Number(data.totalSupply),
                      });
                    })}
                  >
                    <div className="space-y-6 divide-y divide-accents_7">
                      <div>
                        <p className="text-sm">
                          This will create a new collection, your existing
                          collection will remain the same
                        </p>
                      </div>
                      <div className="space-y-2 pt-6">
                        <div className="flex flex-col space-y-1">
                          <span className="font-base text-xs">
                            Collection name
                          </span>
                          <input
                            className="rounded-lg focus:outline-black focus:border-gray-500 block w-full appearance-none border border-border bg-background py-3 px-4 font-plus-jakarta-sans text-sm text-foreground focus:bg-background"
                            defaultValue="development"
                            type="string"
                            {...register("name", {
                              required: true,
                              maxLength: 20,
                              minLength: 3,
                              pattern: /^[-/a-z0-9]+$/gi,
                            })}
                          />
                          {errors.name && (
                            <span className="text-xs text-error">
                              {errors.name.type === "required"
                                ? "This field is required"
                                : errors.name.type === "pattern"
                                ? "We only accept - and / for special characters"
                                : "Must be between 3 and 20 characters long"}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col space-y-1">
                          <span className="font-base text-xs">
                            Total Supply
                          </span>
                          <input
                            className="rounded-lg focus:outline-black focus:border-gray-500 block w-full appearance-none border border-border bg-background py-3 px-4 font-plus-jakarta-sans text-sm text-foreground focus:bg-background"
                            defaultValue={10000}
                            type="number"
                            {...register("totalSupply", {
                              required: true,
                              min: 1,
                              max: 20000,
                            })}
                          />
                          {errors.totalSupply && (
                            <span className="text-xs text-error">
                              Must be smaller than 10000
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between pt-6">
                          <div className="ml-[auto]">
                            <Button>
                              <span className="flex items-center justify-center space-x-2 px-4 py-4">
                                <span className="text-xs">Confirm</span>
                              </span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Index;
