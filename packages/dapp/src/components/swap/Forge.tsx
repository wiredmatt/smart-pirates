import { FC, useEffect, useState } from "react";
import { currencies, resources } from "../../utils/web3";
import TokenSelector from "./TokenSelector";
import SwapIcon from "../../icons/swap";
import { useCurrency, useResource } from "../../hooks/useToken";
import Approve from "./Approve";
import Melt from "./Melt";
import { toast } from "react-toastify";

interface IProps {}

const Forge: FC<IProps> = () => {
  const [tokenInAmount, setTokenInAmount] = useState<number>(1);

  const { symbol, allowance } = useResource("gold");

  const { exchangeRate } = useCurrency("doubloon");

  const [_allowance, setAllowance] = useState(0);

  useEffect(() => {
    (async () => {
      const _allowance = await allowance(currencies.doubloon.address); // get the amount that the user allowed the doubloon maker to use.
      setAllowance(parseInt(_allowance));
    })();
  }, [tokenInAmount, allowance]);

  return (
    <div>
      <div className="flex flex-row space-x-8 justify-center place-content-center">
        <TokenSelector
          canChangeToken={false}
          canChangeAmount={true}
          onAmountChange={(amount) => setTokenInAmount(amount)}
          token={resources.gold}
          amount={tokenInAmount}
          id={"tokenIn"}
          required
        />
        <SwapIcon height={200} width={200} />
        <TokenSelector
          canChangeToken={false}
          token={currencies.doubloon}
          amount={exchangeRate * tokenInAmount}
          id={"tokenOut"}
        />
      </div>
      <div className="flex justify-center pt-4">
        {_allowance < tokenInAmount ? (
          <Approve
            symbol={symbol}
            amount={tokenInAmount}
            onClick={async () => {
              const tx = await resources.gold.approve(
                tokenInAmount,
                currencies.doubloon.address
              );

              await tx.wait();

              const _allowance = await allowance(currencies.doubloon.address); // get the amount that the user allowed the doubloon maker to use.
              setAllowance(parseInt(_allowance));
            }}
          />
        ) : (
          <Melt
            symbol={symbol}
            amount={tokenInAmount}
            onClick={async () => {
              try {
                const tx = await currencies.doubloon.instance.makeDoubloon(
                  tokenInAmount.toString()
                );

                await tx.wait();
                setTokenInAmount(1);
                const _allowance = await allowance(currencies.doubloon.address); // get the amount that the user allowed the doubloon maker to use.
                setAllowance(parseInt(_allowance));
              } catch (e) {
                toast.error("Specified amount exceeds balance.");
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Forge;
