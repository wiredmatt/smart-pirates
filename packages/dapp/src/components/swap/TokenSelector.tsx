import { Avatar } from "degen";
import { FC } from "react";
import { useToken } from "../../hooks/useToken";
import { currencies, Token } from "../../utils/web3";
import Dropdown from "../Dropdown";

interface IProps {
  id: string;
  token?: Token;
  required?: boolean;
  onTokenChange?: (amount: number) => void;
  onAmountChange?: (amount: number) => void;
  canChangeToken?: boolean;
  canChangeAmount?: boolean;
  amount?: number;
}

const TokenSelector: FC<IProps> = ({
  id,
  token,
  required,
  canChangeToken,
  canChangeAmount,
  onAmountChange,
  onTokenChange,
  amount,
}) => {
  const { icon, symbol } = useToken(token || currencies.doubloon);

  return (
    <div className="border text-sm rounded-lg w-full p-2.5 bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500 space-y-6 flex flex-col justify-center">
      <div className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center rounded-full bg-gray-900">
        {canChangeToken ? (
          <Dropdown options={[]}>
            <div className="flex flex-row">
              <div className="px-4 py-2">
                <Avatar src={icon} label="logo" size={"36"} />
              </div>
              <span className="align-middle text-9xl pr-12 py-6">{symbol}</span>
            </div>
          </Dropdown>
        ) : (
          <div className="flex flex-row">
            <div className="px-4 py-2">
              <Avatar src={icon} label="logo" size={"36"} />
            </div>
            <span className="align-middle text-9xl pr-12 py-6">{symbol}</span>
          </div>
        )}
      </div>
      <input
        type="number"
        value={amount || ""}
        min={1}
        id={id}
        className="text-center text-lg w-full p-2.5 rounded-lg bg-gray-600 placeholder-gray-400 border-none"
        placeholder="0.00"
        required={required}
        disabled={!canChangeAmount}
        onChange={(e) => {
          if (onAmountChange) {
            const amount = parseInt(e.target.value);
            onAmountChange(amount);
          }
        }}
      />
    </div>
  );
};

export default TokenSelector;
