import { FC, useEffect, useState } from "react";
import { currencies, Item, items } from "../../utils/web3";
import TokenSelector from "./TokenSelector";
import SwapIcon from "../../icons/swap";
import { useCurrency, useItem } from "../../hooks/useToken";
import Approve from "./Approve";
import { toast } from "react-toastify";
import Buy from "./Buy";

interface IProps {
  canChangeOut?: boolean;
}

const Swap: FC<IProps> = ({ canChangeOut }) => {
  const [tokenInAmount, setTokenInAmount] = useState<number>(1);

  const [tokenOut, setTokenOut] = useState<Item>(items.rum);

  const { allowance, symbol: currencySymbol } = useCurrency("doubloon");

  const [_allowance, setAllowance] = useState(0);

  const { exchangeRate, symbol } = useItem(
    tokenOut?.name.toLowerCase() as "bread" | "rum"
  );

  useEffect(() => {
    (async () => {
      const _allowance = await allowance(tokenOut.address); // get the amount that the user allowed the doubloon maker to use.
      setAllowance(parseInt(_allowance));
    })();
  }, [tokenInAmount, allowance, tokenOut]);

  return (
    <div>
      <div className="flex flex-row space-x-8 justify-center place-content-center">
        <TokenSelector
          canChangeToken={false}
          canChangeAmount={true}
          onAmountChange={(amount) => setTokenInAmount(amount)}
          token={currencies.doubloon}
          amount={tokenInAmount}
          id={"tokenIn"}
          required
        />
        <SwapIcon height={200} width={200} />
        <TokenSelector
          canChangeToken={canChangeOut}
          onTokenChange={(t) => setTokenOut(t as Item)}
          token={tokenOut}
          amount={parseFloat((tokenInAmount / exchangeRate).toFixed(2))}
          id={"tokenOut"}
          options={Object.values(items)}
        />
      </div>
      <div className="flex justify-center pt-4">
        {tokenOut?.address ? (
          _allowance < tokenInAmount ? (
            <Approve
              symbol={currencySymbol}
              amount={tokenInAmount}
              onClick={async () => {
                const tx = await tokenOut.approveTrade(tokenInAmount);

                await tx.wait();

                const _allowance = await allowance(tokenOut?.address);
                setAllowance(parseInt(_allowance));
              }}
            />
          ) : (
            <Buy
              symbol={symbol}
              amount={tokenInAmount / exchangeRate}
              onClick={async () => {
                try {
                  const tx = await tokenOut.instance.buy(tokenInAmount);

                  await tx.wait();

                  setTokenInAmount(1);
                  const _allowance = await allowance(
                    currencies.doubloon.address
                  );
                  setAllowance(parseInt(_allowance));
                } catch (e) {
                  toast.error("Specified amount exceeds balance.");
                }
              }}
            />
          )
        ) : (
          "token not found"
        )}
      </div>
    </div>
  );
};

export default Swap;
