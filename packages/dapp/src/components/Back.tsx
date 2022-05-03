import { FC } from "react";

interface IProps {
  url: string;
}

const Back: FC<IProps> = ({ url }) => {
  return (
    <a
      className="hover:scale-105 transition-transform cursor-pointer"
      href={url}
    >
      <img
        className="relative"
        width={96}
        height={96}
        src="/assets/wooden_arrow.png"
        alt="back"
      ></img>
      <span className="text-white absolute top-14 left-6">Go back</span>
    </a>
  );
};

export default Back;
