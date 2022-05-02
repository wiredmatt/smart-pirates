import { FC } from "react";
import { GoldMine } from "../utils/web3";

interface IProps {
  gm: GoldMine;
}

const GoldMineCard: FC<IProps> = ({ gm }) => {
  const { address, name, description } = gm;

  return (
    <a
      href={`/mine/${address}`}
      className="hover:scale-105 transition-transform"
      title={description}
    >
      <div className="rounded-2xl bg-zinc-600 bg-opacity-80 hover:bg-opacity-100">
        <div className="relative h-full flex flex-col">
          <span className="absolute pl-4 pt-2 text-2xl">{name}</span>
          <img
            src={"/assets/mining/mine.png"}
            alt={name}
            className="px-4 pt-20 pb-8"
            height={250}
            width={250}
          ></img>
        </div>
      </div>
    </a>
  );
};

export default GoldMineCard;
