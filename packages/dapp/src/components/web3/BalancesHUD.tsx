import { FC } from "react";
import { useCurrency, useResource } from "../../hooks/useToken";
import TokenFrame from "./TokenFrame";

interface IProps {}

const BalancesHUD: FC<IProps> = () => {
  const DBL = useCurrency("doubloon");

  const GLD = useResource("gold");
  const STN = useResource("stone");

  return (
    <div className="flex flex-row space-x-4">
      {[DBL, GLD, STN].map((token, i) => (
        <TokenFrame
          key={i}
          name={token.name}
          symbol={token.symbol}
          balance={token.balance}
          icon={token.icon}
          description={token.description}
          address={token.address}
          decimals={token.decimals}
        ></TokenFrame>
      ))}
    </div>
  );
};

export default BalancesHUD;
