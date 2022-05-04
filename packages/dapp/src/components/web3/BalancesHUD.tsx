import { FC } from "react";
import { useCurrency, useResource } from "../../hooks/useToken";
import TokenFrame from "./TokenFrame";

interface IProps {
  address?: string;
}

const BalancesHUD: FC<IProps> = ({ address }) => {
  const DBL = useCurrency("doubloon", address);

  const GLD = useResource("gold", address);
  const STN = useResource("stone", address);

  return (
    <div className="flex flex-row space-x-4 justify-center">
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
