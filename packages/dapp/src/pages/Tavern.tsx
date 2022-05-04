import { FC, useCallback, useEffect, useState } from "react";
import Back from "../components/Back";
import BalancesHUD from "../components/web3/BalancesHUD";
import useAudio from "../hooks/useAudio";
import TavernSwap from "../components/swap";

interface IProps {}

const Tavern: FC<IProps> = () => {
  const { play, playing } = useAudio("/assets/sounds/door_open.mp3", 0.08);
  const [played, setPlayed] = useState(false);

  const openDoor = useCallback(() => {
    if (!played && !playing) {
      play();
      setPlayed(true);
    }
  }, [play, playing, played, setPlayed]);

  useEffect(() => {
    if (!played) {
      openDoor();
    }
  }, [played, setPlayed, openDoor]);

  return (
    <div className="h-full w-full relative">
      <div className="flex px-8 pb-2 animate-fade transition-all">
        <img
          src="/assets/backgrounds/pub_bg.jpg"
          className="flex object-cover overflow-x-hidden rounded-3xl"
          alt="pub"
        ></img>
        <div className="absolute left-12 top-4 z-20">
          <Back url="/" />
        </div>
        <div className="absolute top-4 right-14 text-white space-x-1">
          <BalancesHUD />
        </div>

        <div className="absolute top-28 text-white px-36 w-full space-y-12">
          <h1 className="text-4xl text-center text-white ">
            Specify the amount of Doubloons to spend
          </h1>
          <div className="h-full flex flex-row justify-center">
            <TavernSwap canChangeOut={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tavern;
