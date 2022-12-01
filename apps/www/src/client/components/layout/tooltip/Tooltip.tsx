import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";
import { ElementType, forwardRef, Fragment } from "react";

interface Props {
  variant?: "success" | "error" | "warning" | "info" | "highlight";
  as?: ElementType<any> | undefined;
  className?: string;
  description: string;
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export type TooltipProps = Props & NativeAttrs;

const Tooltip = forwardRef<HTMLAnchorElement, React.PropsWithChildren<Props>>(
  ({
    variant = "info",
    as,
    className,
    children,
    description,
    ...props
  }: React.PropsWithChildren<TooltipProps>) => {
    return (
      <Popover>
        <Popover.Button
          as={as}
          className={clsx(
            "h-3 w-3",
            variant === "info" && "text-darkGrey",
            variant === "highlight" && "text-blueHighlight",
            variant === "success" && "text-greenDot",
            variant === "error" && "text-redError",
            variant === "warning" && "text-orangeWarning",
            className,
          )}
          {...props}
        />
        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="bg-black absolute top-0 left-6 z-10 w-[200px] -translate-y-1/4 rounded-[5px]">
            <div className="p-2 shadow-lg">
              <p className="text-white whitespace-pre-wrap text-[0.65rem] font-normal normal-case">
                {description}
              </p>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    );
  },
);

Tooltip.displayName = "Tooltip";
export default Tooltip;
