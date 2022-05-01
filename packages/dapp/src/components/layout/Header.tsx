import { Stack, Avatar, Heading } from "degen";
import { FC } from "react";
import Wallet from "../web3/Wallet";

interface IProps {}

const Header: FC<IProps> = ({}) => {
  return (
    <>
      <div className="flex flex-col justify-center md:flex-row md:justify-between md:px-12">
        <div className="pt-5 self-center">
          <Avatar src="/assets/the_tavern_2.jpg" label="logo" size={"36"}></Avatar>
        </div>

        <div className="font-lobster md:pt-14 text-center">
          <h1 className="text-4xl">The Decentralized Tavern</h1>
        </div>

        <div className="pt-12 hidden lg:block mt-1">
          <Wallet />
        </div>
      </div>
    </>
  );
};

export default Header;
