import { CSSProperties, FC } from "react";
import { ReactComponent as SwapIcon } from "./swap.svg";

interface IProps {
  height?: number;
  width?: number;
  style?: CSSProperties | undefined;
}

const Swap: FC<IProps> = ({ height, width, style }) => {
  return (
    <SwapIcon
      fill="#FFFFFF"
      height={height || 32}
      width={width || 32}
      style={style}
    />
  );
};

export default Swap;
