import { FC } from "react";

interface IProps {}

const Back: FC<IProps> = () => {
  return (
    <div
      className="hover:scale-105 transition-transform cursor-pointer"
      onClick={() => {
        window.location.href = document.referrer;
      }}
    >
      <img
        className="relative"
        width={96}
        height={96}
        src="/assets/wooden_arrow.png"
        alt="back"
      ></img>
      <span className="text-white absolute top-14 left-6">Go back</span>
    </div>
  );
};

export default Back;
