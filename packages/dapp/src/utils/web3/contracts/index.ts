import GoldABI from "./abis/Gold.json";
import StoneABI from "./abis/Stone.json";
import DoubloonABI from "./abis/Doubloon.json";
import GoldMineABI from "./abis/GoldMine.json";
import BreadABI from "./abis/Bread.json";
import RumABI from "./abis/Rum.json";

import GoldDataDev from "./data/development/Gold.json";
import StoneDataDev from "./data/development/Stone.json";
import DoubloonDataDev from "./data/development/Doubloon.json";
import GoldMinesDataDev from "./data/development/GoldMines.json";
import BreadDataDev from "./data/development/Bread.json";
import RumDataDev from "./data/development/Rum.json";

import GoldData from "./data/mumbai/Gold.json";
import StoneData from "./data/mumbai/Stone.json";
import DoubloonData from "./data/mumbai/Doubloon.json";
import GoldMinesData from "./data/mumbai/GoldMines.json";
import BreadData from "./data/mumbai/Bread.json";
import RumData from "./data/mumbai/Rum.json";

export { GoldABI, StoneABI, DoubloonABI, GoldMineABI, BreadABI, RumABI };

export const getContractData = (
  contract: "gold" | "stone" | "doubloon" | "goldmines" | "bread" | "rum"
) => {
  switch (contract) {
    case "gold":
      return process.env.REACT_APP_BLOCKCHAIN === "development" ? GoldDataDev : GoldData;

    case "stone":
      return process.env.REACT_APP_BLOCKCHAIN === "development"
        ? StoneDataDev
        : StoneData;

    case "doubloon":
      return process.env.REACT_APP_BLOCKCHAIN === "development"
        ? DoubloonDataDev
        : DoubloonData;

    case "bread":
      return process.env.REACT_APP_BLOCKCHAIN === "development"
        ? BreadDataDev
        : BreadData;

    case "rum":
      return process.env.REACT_APP_BLOCKCHAIN === "development" ? RumDataDev : RumData;

    default:
      return { address: "" };
  }
};

export const getGoldMinesData = () => {
  return process.env.REACT_APP_BLOCKCHAIN === "development"
    ? GoldMinesDataDev
    : GoldMinesData;
};
