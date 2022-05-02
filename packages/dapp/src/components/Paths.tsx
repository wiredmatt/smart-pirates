import { FC } from "react";
import PathCard from "./PathCard";

interface IProps {}

const paths = [
  {
    title: "The Mines",
    url: "/mines",
    description: "Try your luck and find some gold",
    image: "/assets/paths/the_mines.png",
  },
  {
    title: "The Blacksmith",
    url: "/blacksmith",
    description: "Melt your gold and get doubloons",
    image: "/assets/paths/the_blacksmith.png",
  },
  {
    title: "The Tavern",
    url: "/tavern",
    description: "Exchange your coin for food and drink",
    image: "/assets/paths/the_tavern.png",
  },
];

const Paths: FC<IProps> = () => {
  return (
    <div className="h-64">
      <div className="flex flex-row justify-between space-x-8 self-center">
        {paths.map((p) => (
          <PathCard {...p} key={p.url} />
        ))}
      </div>
    </div>
  );
};

export default Paths;
