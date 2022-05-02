import { FC } from "react";

interface PathObject {
  title: string;
  url: string;
  description: string;
  image: string;
}

const PathCard: FC<PathObject> = ({ title, description, image, url }) => {
  return (
    <a href={url} className="hover:scale-105 transition-transform">
      <div className="rounded-2xl bg-orange-300">
        <div className="relative h-full w-96">
          <span className="absolute pl-4 pt-2 text-xl">{title}</span>
          <img
            src={image}
            alt={title}
            className="flex object-fill rounded-t-2xl"
          ></img>
          <div className="text-center text-black px-2 py-2">
            <span className="py-8 text-2xl">{description}</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default PathCard;
