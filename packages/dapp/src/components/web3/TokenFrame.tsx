import { FC } from "react";
import { toast } from "react-toastify";

interface IProps {
  name: string;
  symbol: string;
  balance: string;
  icon: string;
  description: string;
  address: string;
  decimals: number;
}

const TokenFrame: FC<IProps> = ({
  name,
  symbol,
  balance,
  icon,
  description,
  address,
  decimals,
}) => {
  return (
    <div
      className="h-32 w-32 relative text-black font-black rounded-xl hover:scale-105 transition-transform cursor-pointer"
      title={description + "\nClick to add to Metamask"}
      onClick={() => {
        window.ethereum
          ?.request({
            method: "wallet_watchAsset",
            params: {
              type: "ERC20",
              options: {
                address: address,
                symbol: symbol,
                decimals: decimals,
                image: window.location.origin + icon,
              },
            },
          })
          .then((success) => {
            if (success) {
              toast.info("Token added to Metamask");
            } else {
              toast.error("User rejected to add token");
            }
          });
      }}
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
        className="z-10 absolute top-10 left-12 w-1/3 h-1/3"
        src={icon}
        alt={name}
      ></img>
    </div>
  );
};

export default TokenFrame;
