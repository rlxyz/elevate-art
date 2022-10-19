import { Dialog, Transition } from "@headlessui/react";
import Loading from "components/loading";
import { Fragment, ReactNode, useState } from "react";

interface Props {
  title: string | ReactNode;
  description: string | ReactNode;
  data: { label: string; value: string }[];
  isLoading: boolean;
}

const defaultProps: Props = {
  title: "",
  description: "",
  data: [],
  isLoading: false,
};

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export type ModalProps = Props & NativeAttrs;

const ModalComponent: React.FC<React.PropsWithChildren<ModalProps>> = ({
  description,
  title,
  data,
  isLoading,
}: ModalProps & typeof defaultProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);

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
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative rounded-primary border border-lightGray text-left overflow-hidden shadow-xl transform transition-all sm:max-w-md sm:w-full">
                <Dialog.Title
                  as="h3"
                  className="p-8 border-b border-border bg-white text-foreground text-xl justify-center flex leading-6 font-semibold"
                >
                  {title}
                </Dialog.Title>
                <Dialog.Description>
                  <div className="bg-accents_8 space-y-3 p-8 border-b border-border">
                    <span className="text-sm">{description}</span>
                    {data.map(({ label, value }) => (
                      <div className="space-y-1">
                        <span className="text-[0.6rem] uppercase">{label}</span>
                        <div className="w-full bg-white text-xs p-2 border border-border rounded-primary">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 bg-white divide-x divide-mediumGrey">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onClose();
                      }}
                      className="text-xs text-darkGrey hover:bg-lightGray py-6"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onClose();
                      }}
                      className="text-xs text-success hover:bg-lightGray py-6"
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
  );
};

ModalComponent.defaultProps = defaultProps;
ModalComponent.displayName = "Modal";
export default ModalComponent;
