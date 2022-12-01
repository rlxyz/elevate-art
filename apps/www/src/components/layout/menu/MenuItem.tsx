import { Menu } from "@headlessui/react";
import clsx from "clsx";
import React from "react";

export interface Props {
  as: React.ElementType;
}

export type MenuItemProps = Props & Omit<React.AnchorHTMLAttributes<any>, keyof Props>;

const ModalItemComponent = React.forwardRef<HTMLAnchorElement, React.PropsWithChildren<MenuItemProps>>(
  ({ as, className, children, ...props }: React.PropsWithChildren<MenuItemProps>, ref: React.Ref<HTMLAnchorElement>) => {
    return (
      <Menu.Items
        {...props}
        as={as}
        ref={ref}
        className={clsx(className, "hover:bg-mediumGrey flex w-full items-center space-x-2 rounded-[3px] py-1.5 px-1 text-xs")}
      >
        {children}
      </Menu.Items>
    );
  },
);

ModalItemComponent.displayName = "ModalItem";
export default ModalItemComponent;
