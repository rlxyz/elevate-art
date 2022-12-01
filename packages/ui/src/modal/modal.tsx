import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";
import Loading from "../loading";

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
              <Dialog.Panel className="relative transform overflow-hidden rounded-primary border border-border text-left shadow-xl transition-all sm:w-full sm:max-w-md">
                <Dialog.Title
                  as="h3"
                  className="text-md flex justify-center border-b border-border bg-background p-6 font-semibold leading-6 text-foreground"
                >
                  {title}
                </Dialog.Title>
                <Dialog.Description>
                  <div className="space-y-3 border-b border-border bg-accents_8 p-8">
                    <span className="text-sm">{description}</span>
                    {data.map(({ label, value }) => (
                      <div className="space-y-1">
                        <span className="text-[0.6rem] uppercase">{label}</span>
                        <div className="w-full rounded-primary border border-border bg-background p-2 text-xs">{value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-border bg-background">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        closeModal();
                      }}
                      className={clsx("py-6 text-xs text-accents_5 hover:bg-accents_8")}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      disabled={isLoading}
                      className={clsx("py-6 text-xs text-accents_3 hover:bg-accents_8", isLoading && "cursor-not-allowed")}
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
