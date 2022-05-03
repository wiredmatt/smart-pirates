import { FC, useState } from "react";
import { Token } from "../../utils/web3";
import TokenSelector from "./TokenSelector";
import SwapIcon from "../../icons/swap";

interface IProps {
  tokenIn?: Token;
  tokenOut?: Token;
  canChangeIn?: boolean;
  canChangeOut?: boolean;
}

const Swap: FC<IProps> = ({ tokenIn, tokenOut, canChangeIn, canChangeOut }) => {
  const [tokenInAmount, setTokenInAmount] = useState<number>(0);
  // const [exchangeRate, setExchangeRate] = useState<number>(0);
  const exchangeRate = 2;

  return (
    <div className="flex flex-row space-x-8 justify-center place-content-center">
      <TokenSelector
        canChangeToken={canChangeIn}
        canChangeAmount={true}
        onAmountChange={(amount) => setTokenInAmount(amount)}
        token={tokenIn}
        id={"tokenIn"}
        required
      />
      <SwapIcon height={200} width={200} />
      <TokenSelector
        canChangeToken={canChangeOut}
        token={tokenOut}
        amount={exchangeRate * tokenInAmount}
        id={"tokenOut"}
      />
    </div>
  );
};

export default Swap;
