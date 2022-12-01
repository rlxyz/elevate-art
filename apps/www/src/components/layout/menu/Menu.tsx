import { Menu, Transition } from "@headlessui/react";
import { DotsHorizontalIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { FC, Fragment } from "react";

const MenuComponent: FC<React.AnchorHTMLAttributes<any>> = ({ className, children, ...props }) => {
  return (
    <Menu as="div" className="absolute right-0 top-1/2 z-[5] mr-2 flex -translate-y-1/2 items-center ">
      <Menu.Button className="text-darkGrey rounded-[5px]">
        <DotsHorizontalIcon className="hover:bg-mediumGrey mx-0.25 h-4 w-4 rounded-[3px]" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          {...props}
          className={clsx(
            className,
            "z-5 bg-white rounded-md absolute top-1/2 left-5 z-[5] mt-2 w-56 -translate-y-1/4 overflow-visible font-normal shadow-lg",
          )}
        >
          <div className="ring-black overflow-hidden rounded-[5px] shadow-lg ring-1 ring-opacity-5">
            <div className="bg-lightGray divide-mediumGrey divide-y ">{children}</div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

MenuComponent.displayName = "Menu";
export default MenuComponent;
