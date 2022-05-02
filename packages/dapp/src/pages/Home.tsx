import { FC, useEffect } from "react";
import Paths from "../components/Paths";
import BalancesHUD from "../components/web3/BalancesHUD";
import useAudio from "../hooks/useAudio";

interface IProps {}

const Home: FC<IProps> = () => {
  const { play } = useAudio("/assets/sounds/main.mp3", 0.01);

  useEffect(() => {
    play();
  }, [play]); // play in loop

  return (
    <div className="h-full w-full relative">
      <div className="flex px-8 pb-2 animate-fade transition-all">
        <img
          src="/assets/backgrounds/main_bg.jpg"
          className="flex object-fit overflow-x-hidden rounded-3xl"
          alt="pub"
        ></img>
        <div className="absolute top-2 right-12 text-white space-x-1 object-fit">
          <BalancesHUD />
        </div>
        <div className="absolute top-48 text-white px-36 w-1/2">
          <Paths />
        </div>
      </div>
    </div>
  );
};

export default Home;
