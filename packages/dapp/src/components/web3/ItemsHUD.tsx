import { FC } from "react";
import { useItem } from "../../hooks/useToken";
import TokenFrame from "./TokenFrame";

interface IProps {
  address: string;
}

const ItemsHUD: FC<IProps> = ({address}) => {
  const BRD = useItem("bread", address);
  const RUM = useItem("rum", address);

  return (
    <div className="flex flex-row space-x-4 justify-center">
      {[BRD, RUM].map((token, i) => (
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

export default ItemsHUD;
