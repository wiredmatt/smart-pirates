import { FC } from "react";
import { useParams } from "react-router-dom";
import BalancesHUD from "../components/web3/BalancesHUD";
import ItemsHUD from "../components/web3/ItemsHUD";
import {
  getRandomPirateAvatar,
  getRandomPirateProfile,
} from "../utils/web3/pirateGenerator";

interface IProps {}

const PirateProfile: FC<IProps> = () => {
  const { address } = useParams();

  if (!address) return null;

  const profile = getRandomPirateProfile(address);
  const avatar = getRandomPirateAvatar(address);

  return (
    <div className="flex flex-row w-full justify-center">
      <div className="flex items-center justify-center space-x-8">
        <div className="bg-paper-pattern rounded-md w-1/3">
          <div className="flex items-center justify-center pt-10 flex-col">
            <img
              src={avatar}
              alt={profile.name}
              className="rounded-full w-32"
            />
            <h1 className="text-gray-800 font-semibold text-xl mt-5">
              {profile.name}
            </h1>
            <h1 className="text-gray-100 text-2xl">{profile.location}</h1>
            <h1 className="text-gray-100 text-2xl p-4 text-center">
              {profile.bio}
            </h1>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <h1 className="text-white pb-4 text-center text-lg">
            This pirate has this stuff:
          </h1>
          <div className="flex flex-col justify-center space-y-4">
            <BalancesHUD address={address} />
            <ItemsHUD address={address} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PirateProfile;
