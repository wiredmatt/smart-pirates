import { FC, useEffect } from "react";
import Swap from "../components/swap";
import BalancesHUD from "../components/web3/BalancesHUD";
import useAudio from "../hooks/useAudio";
import { currencies, resources } from "../utils/web3";

interface IProps {}

const Forge: FC<IProps> = () => {
  const { play } = useAudio("/assets/sounds/forge.mp3", 0.03);

  useEffect(() => {
    play();
  }, [play]); // play in loop

  return (
    <div className="h-full w-full relative">
      <div className="flex px-8 pb-2 animate-fade transition-all">
        <img
          src="/assets/backgrounds/forge_bg.jpg"
          className="flex object-fit overflow-x-hidden rounded-3xl"
          alt="blacksmith"
        ></img>
        <div className="absolute top-4 right-14 text-white space-x-1 object-fit">
          <BalancesHUD />
        </div>
        <div className="absolute top-36 text-white px-36 w-full space-y-24">
          <h1 className="text-4xl text-center text-white">
            Specify the amount of Gold you want to melt
          </h1>
          <div className="h-full flex flex-row justify-center">
            <Swap tokenIn={resources.gold} tokenOut={currencies.doubloon} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forge;
