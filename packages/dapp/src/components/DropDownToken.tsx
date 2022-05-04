import { FC } from "react";
import { useToken } from "../hooks/useToken";
import { Token } from "../utils/web3";

interface IProps {
  token: Token;
}

const DropDownToken: FC<IProps> = ({ token }) => {
  const { symbol, icon } = useToken(token);

  return (
    <div className="flex flex-row space-x-5">
      <img src={icon} width={24} height={24} alt={symbol}></img>
      <span>{symbol}</span>
    </div>
  );
};

export default DropDownToken;
