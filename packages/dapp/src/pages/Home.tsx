import { FC } from "react";

interface IProps {}

const Home: FC<IProps> = () => {
  return (
    <div className="h-full w-full px-8 pb-2 relative">
      <img src="/assets/pub_bg.jpg" className="object-cover rounded-3xl"></img>
      <div className="absolute top-0">
        
      </div>
    </div>
  );
};

export default Home;
