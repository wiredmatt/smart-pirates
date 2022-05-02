import { Avatar } from "degen";
import { FC } from "react";
import Wallet from "../web3/Wallet";

interface IProps {}

const Header: FC<IProps> = () => {
  return (
    <>
      <div className="flex flex-col justify-center md:flex-row md:justify-between md:px-12 w-full font-lobster">
        <div className="pt-5 self-center hover:scale-105 transition-transform">
          <a href="/">
            <Avatar
              src="/assets/logo.jpg"
              label="logo"
              size={"36"}
            ></Avatar>
          </a>
        </div>

        <div className="md:pt-14 md:pl-48">
          <h1 className="text-center md:text-left text-4xl">
            Smart Pirates
          </h1>
        </div>

        <div className="pt-12 hidden md:inline-flex mt-1 w-96 justify-end">
          <Wallet />
        </div>
      </div>
    </>
  );
};

export default Header;
