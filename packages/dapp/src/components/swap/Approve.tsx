import { FC } from "react";
import Button from "../Button";

interface IProps {
  amount: number;
  symbol: string;
  onClick: () => void;
}

const Approve: FC<IProps> = ({ symbol, amount, onClick }) => {
  return (
    <div>
      <Button bgColor="bg-black" textSize="text-2xl" onClick={onClick}>
        Approve {amount} {symbol}
      </Button>
    </div>
  );
};

export default Approve;
