import { FC } from "react";
import PathCard from "./DestinationCard";

interface IProps {}

const paths = [
  {
    title: "The Mines",
    url: "/mines",
    description: "Try your luck and find some gold",
    image: "/assets/destinations/the_mines.png",
  },
  {
    title: "The Blacksmith",
    url: "/blacksmith",
    description: "Melt your gold and get doubloons",
    image: "/assets/destinations/the_blacksmith.png",
  },
  {
    title: "The Tavern",
    url: "/tavern",
    description: "Exchange your coin for food and drink",
    image: "/assets/destinations/the_tavern.png",
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
