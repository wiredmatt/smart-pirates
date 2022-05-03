import { FC, useEffect } from "react";
import BalancesHUD from "../components/web3/BalancesHUD";
import useAudio from "../hooks/useAudio";

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
        <div className="absolute top-36 text-white px-36 w-full space-y-4">
          <h1 className="text-4xl text-center text-white">
            Specify the amount of Gold you want to melt
          </h1>
          <span>hello world</span>
        </div>
      </div>
    </div>
  );
};

export default Forge;
