import { Avatar } from "degen";
import { FC } from "react";
import { useToken } from "../../hooks/useToken";
import { currencies, Token } from "../../utils/web3";

interface IProps {
  id: string;
  token?: Token;
  required?: boolean;
  onTokenChange?: void;
  onAmountChange?: void;
}

const TokenSelector: FC<IProps> = ({ id, token, required }) => {
  const { icon, symbol } = useToken(token || currencies.doubloon);

  return (
    <div className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500 space-y-6">
      <div className="rounded-full bg-gray-900 flex flex-row">
        <div className="px-4 py-2">
          <Avatar src={icon} label="logo" size={"36"} />
        </div>
        <span className="align-middle text-9xl pr-12 py-6">{symbol}</span>
      </div>
      <input
        type="text"
        id={id}
        className="text-lg w-full p-2.5 bg-gray-700 placeholder-gray-400 border-none"
        placeholder="0.00"
        required={required}
      />
    </div>
  );
};

export default TokenSelector;
