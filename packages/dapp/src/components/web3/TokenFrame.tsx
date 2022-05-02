import { FC } from "react";

interface IProps {
  name: string;
  symbol: string;
  balance: string;
  icon: string;
  description: string;
}

const TokenFrame: FC<IProps> = ({
  name,
  symbol,
  balance,
  icon,
  description,
}) => {
  return (
    <div
      className="h-32 w-32 relative text-black font-black rounded-xl  hover:scale-105 transition-transform"
      title={description}
    >
      <img
        src="/assets/backgrounds/paper_bg.jpg"
        className="flex object-cover overflow-x-hidden absolute opacity-75 rounded-xl"
        alt="paper background"
      ></img>
      <img
        src="/assets/frame.png"
        className="flex object-cover overflow-x-hidden absolute rounded-xl"
        alt="item frame"
      ></img>
      <div className="z-10 absolute text-center w-full h-full pt-5">
        <span>{balance}</span>{" "}
        <span>
          {Array.from(symbol)
            .map((l) => `${l} `)
            .join(" ")
            .trim()}
        </span>
      </div>
      <img
        className="z-10 absolute top-12 left-12"
        width={40}
        height={40}
        src={icon}
        alt={name}
      ></img>
    </div>
  );
};

export default TokenFrame;
