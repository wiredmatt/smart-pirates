import { FC } from "react";
import useToken from "../hooks/useToken";

interface IProps {}

const Home: FC<IProps> = () => {
  const [balance, name, symbol] = useToken("doubloon");

  return (
    <div className="h-full w-full px-8 pb-2 relative">
      <img src="/assets/pub_bg.jpg" className="object-cover rounded-3xl"></img>
      <div className="absolute top-0 text-white space-x-1">
        <span>{balance}</span> <span>{symbol}</span> 
      </div>
    </div>
  );
};

export default Home;
