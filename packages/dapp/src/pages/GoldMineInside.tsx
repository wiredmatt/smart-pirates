import { FC } from "react";
import { useParams } from "react-router-dom";

interface IProps {}

const GoldMineInside: FC<IProps> = () => {
  let params = useParams(); // params.address

  return <div>{params.address}</div>;
};

export default GoldMineInside;
