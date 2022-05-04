import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { FC } from "react";
import { Token } from "../utils/web3";
import DropDownToken from "./DropDownToken";

interface IProps {
  title?: string;
  options: Token[];
  onSelect: (token: Token) => void;
}

const Dropdown: FC<IProps> = ({ title, options, onSelect }) => {
  const Options = options?.map((o) => (
    <button
      className="text-white group flex w-full items-center rounded-md px-2 py-2 text-lg"
      onClick={() => onSelect(o)}
    >
      {<DropDownToken token={o} />}
    </button>
  ));

  return (
    <Menu
      as="div"
      className="h-full text-left rounded-full flex justify-end place-content-end"
    >
      <Menu.Button className="rounded-full inline-flex w-full justify-center bg-opacity-20 px-4 py-2 font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
        <p>{title}</p>
        <ChevronDownIcon
          className="absolute bottom-24 right-0 ml-2 -mr-1 text-violet-200 hover:text-violet-100 h-10 w-10"
          aria-hidden="true"
        />
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
        <Menu.Items className="absolute right-0 bottom-0 w-56 divide-gray-100 rounded-md bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1">
            {Options?.map((OptionElement, i) => (
              <Menu.Item key={i}>{OptionElement}</Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Dropdown;
