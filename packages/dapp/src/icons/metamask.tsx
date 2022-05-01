import { CSSProperties, FC } from "react";
import { ReactComponent as MetamaskIcon } from "./metamask.svg";

interface IProps {
  height?: number;
  width?: number;
  style?: CSSProperties | undefined;
}

const Metamask: FC<IProps> = ({ height, width, style }) => {
  return (
    <MetamaskIcon height={height || 32} width={width || 32} style={style} />
  );
};

export default Metamask;
