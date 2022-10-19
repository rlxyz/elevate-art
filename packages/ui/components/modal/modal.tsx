import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import Loading from "components/loading";
import { Fragment, useEffect, useState } from "react";

interface Props {
  title: string;
  description: string;
  data: { label: string; value: string }[];
  isLoading: boolean;
  onClose?: () => void;
  visible?: boolean;
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
  visible: customVisible,
  onClose,
  description,
  title,
  data,
  isLoading,
}: ModalProps & typeof defaultProps) => {
  const [visible, setVisible] = useState(false);

  const closeModal = () => {
    onClose && onClose();
    setVisible(false);
  };

  useEffect(() => {
    if (typeof customVisible === "undefined") return;
    setVisible(customVisible);
  }, [customVisible]);

  return (
    <Transition appear show={visible} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-foregroundLight" />
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
              <Dialog.Panel className="relative rounded-primary border border-border text-left overflow-hidden shadow-xl transform transition-all sm:max-w-md sm:w-full">
                <Dialog.Title
                  as="h3"
                  className="p-6 border-b border-border bg-background text-foreground text-md justify-center flex leading-6 font-semibold"
                >
                  {title}
                </Dialog.Title>
                <Dialog.Description>
                  <div className="bg-accents_8 space-y-3 p-8 border-b border-border">
                    <span className="text-sm">{description}</span>
                    {data.map(({ label, value }) => (
                      <div className="space-y-1">
                        <span className="text-[0.6rem] uppercase">{label}</span>
                        <div className="w-full bg-background text-xs p-2 border border-border rounded-primary">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 bg-background divide-x divide-border">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        closeModal();
                      }}
                      className={clsx(
                        "text-xs text-accents_5 hover:bg-accents_8 py-6"
                      )}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      disabled={isLoading}
                      className={clsx(
                        "text-xs text-accents_3 hover:bg-accents_8 py-6",
                        isLoading && "cursor-not-allowed"
                      )}
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
