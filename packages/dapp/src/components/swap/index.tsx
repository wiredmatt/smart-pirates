import { FC } from "react";
import { Token } from "../../utils/web3";
import TokenSelector from "./TokenSelector";
import SwapIcon from "../../icons/swap";

interface IProps {
  tokenIn?: Token;
  tokenOut?: Token;
}

const Swap: FC<IProps> = ({ tokenIn, tokenOut }) => {
  return (
    <div className="flex flex-row space-x-8 justify-center place-content-center">
      <TokenSelector token={tokenIn} id={"tokenIn"} required />
      <SwapIcon height={200} width={200} />
      <TokenSelector token={tokenOut} id={"tokenOut"} />
    </div>
  );
};

export default Swap;
