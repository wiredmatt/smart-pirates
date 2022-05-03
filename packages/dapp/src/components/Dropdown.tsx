import { Menu, Transition } from "@headlessui/react";
import { ButtonHTMLAttributes, DetailedHTMLProps, Fragment } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { FC } from "react";

interface IProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  title?: string;
  options?: string[];
}

const Dropdown: FC<IProps> = ({ title, options, children }) => {
  return (
    <div className="text-right flex flex-row">
      <Menu
        as="div"
        className="relative text-left rounded-full flex justify-end place-content-end"
      >
        <Menu.Button className="rounded-full inline-flex w-full justify-center bg-opacity-20 px-4 py-2 font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          {children}

          <p>{title}</p>
          <ChevronDownIcon
            className="absolute bottom-20 right-0 ml-2 -mr-1 text-violet-200 hover:text-violet-100 h-10 w-10"
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
          <Menu.Items className="absolute right-0 bottom-0 mt-12 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              {options?.map((o, i) => (
                <Menu.Item key={i}>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-violet-500 text-white" : "text-white"
                      } group flex w-full items-center rounded-md px-2 py-2 text-lg`}
                    >
                      {o}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default Dropdown;
