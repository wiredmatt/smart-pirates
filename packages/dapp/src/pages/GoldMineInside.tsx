import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import Back from "../components/Back";
import BalancesHUD from "../components/web3/BalancesHUD";
import useAudio from "../hooks/useAudio";
import { GoldMines, part } from "../utils/web3";

interface IProps {}

const GoldMineInside: FC<IProps> = () => {
  const { address } = useParams();

  const { play } = useAudio("/assets/sounds/mine.mp3", 0.1);

  useEffect(() => {
    play();
  }, [play]); // play in loop

  const [rows, setRows] = useState<Array<number[]>>(); // rows of spots to mine
  const mine = GoldMines.find((gm) => gm.address === address);

  const { data: account } = useAccount();

  useEffect(() => {
    if (!mine) {
      window.location.href = "/mines";

      return () => {};
    } else {
      (async () => {
        const spotsCount = await mine.spotsCount();
        const rows = part(Array.from(Array(spotsCount).keys()), 2);

        setRows(rows);
      })();
    }

    if (account) {
      toast.dismiss();
      (async () => {
        if (account.connector?.getProvider) {
          const provider = await account.connector?.getProvider();
          const signer = await account.connector?.getSigner();
          if (signer) {
            mine.connect(provider, signer);
          }
        }
      })();
    } else {
      toast.error(
        "Wallet not connected.\n\nConnect it first in order to look for gold",
        {
          toastId: "wallet-not-connected-goldmine",
          position: "bottom-right",
        }
      );
    }
  }, [mine, account]);

  return (
    <div className="h-full w-full relative">
      <div className="flex px-8 pb-2 animate-fade transition-all">
        <img
          src="/assets/backgrounds/dirt_bg.jpg"
          className="flex object-cover overflow-x-hidden rounded-3xl"
          alt="mine"
        ></img>
        <div className="absolute left-12 top-4 z-20">
          <Back />
        </div>
        <div className="absolute top-4 right-14 text-white space-x-1">
          <BalancesHUD />
        </div>
        <h1 className="absolute top-32 pt-4 text-4xl text-center w-full text-white">
          Choose a spot to look for gold
        </h1>
        <div className="absolute top-48 text-white px-8 w-full space-y-5 pt-2">
          {mine &&
            rows?.map((row, i) => (
              <div
                key={i}
                className="flex flex-row space-x-5 w-full justify-center"
              >
                {row.map((spot) => (
                  <div
                    key={spot}
                    className="relative hover:scale-105 transition-transform cursor-pointer"
                    onClick={async () => {
                      const found = await mine.lookForGold(spot);

                      if (found) {
                        toast.success("You found Gold! \n\n+1 Gold ingot");
                      } else {
                        toast.success("You found... Stone!? \n\n+100 stones");
                      }
                    }}
                  >
                    <img
                      src="/assets/mining/spot.png"
                      className="rounded-3xl"
                      alt="mine"
                      width={200}
                      height={200}
                    ></img>
                    <span className="absolute top-36 left-12 text-3xl">
                      {spot}
                    </span>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GoldMineInside;
