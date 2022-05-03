import { FC } from "react";
import Back from "../components/Back";
import GoldMineCard from "../components/GoldMineCard";
import BalancesHUD from "../components/web3/BalancesHUD";
import { part, GoldMines } from "../utils/web3";

interface IProps {}

const Mines: FC<IProps> = () => {
  const rows = part(GoldMines, 2);

  return (
    <div className="h-full w-full relative">
      <div className="flex px-8 pb-2 animate-fade transition-all">
        <img
          src="/assets/backgrounds/mines_bg.png"
          className="flex object-cover overflow-x-hidden rounded-3xl"
          alt="mines"
        ></img>
        <div className="absolute left-16 top-12 z-20">
          <Back />
        </div>
        <div className="absolute top-12 right-24 text-white space-x-1">
          <BalancesHUD />
        </div>
        <h1 className="absolute top-36 pt-4 text-4xl text-center w-full text-black">
          Choose a mine to explore
        </h1>
        <div className="absolute left-0 top-56 text-white px-8 w-full flex flex-col space-y-4">
          {rows.map((row, i) => (
            <div key={i} className="flex flex-row space-x-5 justify-center">
              {row.map((gm) => (
                <GoldMineCard key={gm.address} gm={gm} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mines;
