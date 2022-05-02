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
      className="h-24 w-24 relative text-black font-black rounded-xl"
      title={description}
    >
      <img
        src="/assets/paper_bg.jpg"
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
        className="z-10 absolute top-10 left-8"
        width={36}
        height={36}
        src={icon}
        alt={name}
      ></img>
    </div>
  );
};

export default TokenFrame;
