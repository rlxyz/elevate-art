import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import styles from "./Button.module.css";

interface Props {
  label: string;
  balance: string;
  onDisconnect?: () => void;
}

export const ConnectedButton = ({ label, balance, onDisconnect }: Props) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className={`${styles.button} py-1 px-4 text-sm text-white bg-[#17171a]`}
        >
          {label}
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              <div className="block px-4 py-2 text-sm text-black">{`Balance: ${balance}`}</div>
            </Menu.Item>
            <Menu.Item>
              <button
                onClick={onDisconnect}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-blend-pink text-black"
              >
                Disconnect
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
