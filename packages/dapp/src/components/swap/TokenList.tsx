// import { IconArrowDown } from "degen";
import { FC } from "react";
// import { useToken } from "../../hooks/useToken";
import { Token } from "../../utils/web3";
import Dropdown from "../Dropdown";

interface IProps {
  defaultToken?: Token;
}

const TokenList: FC<IProps> = () => {
  // const token = useToken(defaultToken || currencies.doubloon);

  return (
    <Dropdown />
    // <div>
    //   <button
    //     id="dropdownDefault"
    //     data-dropdown-toggle="dropdown"
    //     classNameName="text-white focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
    //     type="button"
    //   >
    //     <span classNameName="inline-flex items-center justify-center text-xs font-semibold text-white bg-gray-700 rounded-full">
    //       <IconArrowDown size={"16"}></IconArrowDown>
    //     </span>
    //   </button>
    //   <div
    //     id="dropdown"
    //     classNameName="z-10 hidden bg-white divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-700"
    //   >
    //     <ul
    //       classNameName="py-1 text-sm text-gray-700 dark:text-gray-200"
    //       aria-labelledby="dropdownDefault"
    //     >
    //       <li>
    //         <a
    //           href="#"
    //           classNameName="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
    //         >
    //           Dashboard
    //         </a>
    //       </li>
    //       <li>
    //         <a
    //           href="#"
    //           classNameName="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
    //         >
    //           Settings
    //         </a>
    //       </li>
    //       <li>
    //         <a
    //           href="#"
    //           classNameName="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
    //         >
    //           Earnings
    //         </a>
    //       </li>
    //       <li>
    //         <a
    //           href="#"
    //           classNameName="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
    //         >
    //           Sign out
    //         </a>
    //       </li>
    //     </ul>
    //   </div>
    // </div>
  );
};

export default TokenList;
