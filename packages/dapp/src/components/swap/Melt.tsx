import { FC } from "react";
import Button from "../Button";

interface IProps {
  amount: number;
  symbol: string;
  onClick: () => void;
}

const Melt: FC<IProps> = ({ symbol, amount, onClick }) => {
  return (
    <div>
      <Button bgColor="bg-black" textSize="text-2xl" onClick={onClick}>
        Melt {amount} {symbol}
      </Button>
    </div>
  );
};

export default Melt;
