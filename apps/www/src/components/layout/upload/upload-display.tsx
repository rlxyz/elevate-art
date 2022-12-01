import { Disclosure, Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentAddIcon,
  DocumentDuplicateIcon,
  XCircleIcon,
} from "@heroicons/react/outline";
import clsx from "clsx";
import { motion } from "framer-motion";
import Image from "next/image";
import { FC, Fragment, PropsWithChildren } from "react";
import { formatBytes, truncate } from "src/client/utils/format";
import Tooltip from "../tooltip";

export type TraitElementUploadState = {
  name: string;
  imageUrl: string;
  size: number;
  uploaded: boolean;
  type: "new" | "existing" | "invalid" | "readonly";
};

interface Props {
  layerName?: string;
  traits?: TraitElementUploadState[];
  gridSize?: "md" | "lg";
  withTooltip?: boolean;
}

const defaultProps: Props = {
  gridSize: "lg",
};

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export type UploadDisplayProps = Props & NativeAttrs;

const UploadDisplay: FC<PropsWithChildren<UploadDisplayProps>> = ({
  layerName = "",
  traits = [],
  gridSize,
  withTooltip = false,
  ...props
}: React.PropsWithChildren<UploadDisplayProps> & typeof defaultProps) => {
  return (
    <Disclosure {...props}>
      {({ open }) => (
        <>
          <Disclosure.Button className={`border-mediumGrey w-full space-y-2 rounded-[5px] border p-2`}>
            <div className="grid grid-cols-10 ">
              <div className="col-span-9 flex flex-col space-y-3">
                <div className="flex space-x-3">
                  <div className="flex items-center">
                    <div className="border-lightGray bg-darkGrey flex h-[25px] w-[25px] items-center justify-center rounded-[5px] border">
                      <Image src={"/images/not-found.svg"} width={15} height={15} alt={"not-found"} />
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-start space-y-1">
                    <span className="text-sm font-semibold">{layerName}</span>
                    <span className="text-darkGrey text-xs">{formatBytes(traits.reduce((a, b) => a + b.size, 0))}</span>
                  </div>
                </div>
              </div>
              <div className="col-span-1 flex h-full flex-col items-end justify-center">
                {open ? <ChevronUpIcon className="row-span-1 h-3 w-3" /> : <ChevronDownIcon className="row-span-1 h-3 w-3" />}
                <span className="text-xs">
                  {traits.filter((file) => file.uploaded).length} / {traits.length}
                </span>
              </div>
            </div>
            <div className="bg-lightGray border-mediumGrey flex h-2 w-full items-start rounded-[5px] border text-left">
              <motion.div
                style={{
                  width: `${(traits.filter((x) => x.uploaded).length / traits.length) * 100}%`,
                }}
                className={`bg-blueHighlight h-1`}
              />
            </div>
          </Disclosure.Button>
          <Transition
            as={Fragment}
            show={open}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Disclosure.Panel>
              <div className={clsx("grid gap-x-3 gap-y-3", gridSize === "md" && "grid-cols-6", gridSize == "lg" && "grid-cols-12")}>
                {traits
                  .sort((a) => (a.type === "new" ? 1 : a.type === "existing" ? 0 : a.type === "invalid" ? -1 : -2))
                  .map((item, index) => {
                    return (
                      <div key={`${item}-${index}`} className="relative flex flex-col items-center space-y-1">
                        <img width={200} height={200} src={item.imageUrl} className="border-mediumGrey rounded-[5px] border" />
                        {item.uploaded && <CheckCircleIcon className="text-greenDot absolute top-0 right-0 m-1 h-3 w-3 rounded-[3px]" />}
                        {withTooltip &&
                          (item.type === "existing" ? (
                            <Tooltip
                              as={DocumentDuplicateIcon}
                              variant="warning"
                              className="absolute left-0 top-0 m-1 h-4 w-4 rounded-[3px]"
                              description={"Duplicate file found. We are reuploading the image."}
                            />
                          ) : item.type === "new" ? (
                            <Tooltip
                              as={DocumentAddIcon}
                              variant="highlight"
                              className="absolute left-0 top-0 m-1 h-4 w-4 rounded-[3px]"
                              description={"You are uploading a new trait."}
                            />
                          ) : item.type === "invalid" ? (
                            <Tooltip
                              as={XCircleIcon}
                              variant="error"
                              className="absolute left-0 top-0 m-1 h-4 w-4 overflow-auto rounded-[3px]"
                              description={"This file cant be upload. Try again..."}
                            />
                          ) : null)}
                        {/* <XCircleIcon className='absolute rounded-[3px] top-0 right-0 w-4 h-4 text-redError m-1' /> */}
                        <span className="flex w-full items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap text-[0.6rem]">
                          {truncate(item.name)}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

UploadDisplay.displayName = "UploadDisplay";
UploadDisplay.defaultProps = defaultProps;
export default UploadDisplay;
