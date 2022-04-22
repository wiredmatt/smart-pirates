import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import {
  Bread,
  Bread__factory,
  Doubloon,
  Doubloon__factory,
  Gold,
  GoldMine,
  GoldMine__factory,
  Gold__factory,
  Stone,
  Stone__factory,
} from "../typechain";

require("dotenv").config();

const generateRandomSpots = (size: number): boolean[] => {
  let spots: boolean[] = new Array<boolean>(size);

  for (let i = 0; i < size; i++) {
    spots[i] = Math.random() < 0.5;
  }

  return spots;
};

const getGold = async (
  spot: number,
  goldMine: GoldMine,
  exploration_fee: BigNumber
): Promise<boolean> => {
  const found = await goldMine.lookForGold(spot, {
    value: exploration_fee,
  });

  const tx = await found.wait();

  const event = tx.events?.find((event) => event.event === "FoundAsset");

  if (event?.args) {
    const [_, isGold] = event?.args;

    if (isGold) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const fundWallet = async (
  goldMine: GoldMine,
  gold: Gold,
  doubloon: Doubloon
) => {
  const exploration_fee = await goldMine.EXPLORATION_FEE();

  let _found = false;
  let spot = 0;

  while (!_found) {
    _found = await getGold(spot, goldMine, exploration_fee);
    spot++;
  }

  const approveTx = await gold.approve(doubloon.address, 1);
  await approveTx.wait();

  const makeTx = await doubloon.makeDoubloon(1);
  await makeTx.wait();
};

describe(`Contracts tests`, () => {
  let Gold: Gold__factory;
  let gold: Gold;

  let Doubloon: Doubloon__factory;
  let doubloon: Doubloon;

  let Stone: Stone__factory;
  let stone: Stone;

  let GoldMine: GoldMine__factory;
  let goldMine: GoldMine;

  let Bread: Bread__factory;
  let bread: Bread;

  beforeEach(async () => {
    Gold = await ethers.getContractFactory("Gold");
    gold = await Gold.deploy();

    Doubloon = await ethers.getContractFactory("Doubloon");
    doubloon = await Doubloon.deploy(gold.address);

    Stone = await ethers.getContractFactory("Stone");
    stone = await Stone.deploy();

    GoldMine = await ethers.getContractFactory("GoldMine");
    goldMine = await GoldMine.deploy(
      gold.address,
      stone.address,
      generateRandomSpots(100)
    );

    Bread = await ethers.getContractFactory("Bread");
    bread = await Bread.deploy(doubloon.address, process.env.BAKER!);

    await gold.setDoubloonMaker(doubloon.address);
    await gold.allowGoldMine(goldMine.address);
    await stone.allowGoldMine(goldMine.address);
  });

  describe(`Resources mining`, () => {
    it("Should allow a Gold Mine", async () => {
      const allowedGold = await gold.allowedMines(goldMine.address);
      const allowedStone = await gold.allowedMines(goldMine.address);

      expect(allowedGold, "Mine was not allowed for gold").to.equal(true);
      expect(allowedStone, "Mine was not allowed for stone").to.equal(true);
    });

    it("Should mine gold or stone from a Gold Mine", async () => {
      const exploration_fee = await goldMine.EXPLORATION_FEE();

      const found = await goldMine.lookForGold(1, {
        value: exploration_fee,
      });

      const tx = await found.wait();

      const event = tx.events?.find((event) => event.event === "FoundAsset");

      if (event?.args) {
        const [_, isGold] = event?.args;

        if (isGold) {
          console.log("You found Gold!");
          console.log("+1 Gold ingot");
        } else {
          console.log("You found... Stone!?");
          console.log("+100 stones");
        }
      }

      expect(event?.args, "Couldn't look for gold").to.not.be.undefined;
    });

    it("Should mine gold and exchange it for doubloons", async () => {
      await fundWallet(goldMine, gold, doubloon);

      const doubloons = await doubloon.balanceOf(process.env.PUBLIC_KEY!);

      console.log("You now own $DBL", doubloons.toString());

      expect(doubloons.toString()).to.equal("100");
    });

    it("Should buy bread with doubloons", async () => {
      await fundWallet(goldMine, gold, doubloon);

      const approveTx = await doubloon.approve(bread.address, 1);
      await approveTx.wait();

      await bread.bake();

      const breadSlices = await bread.balanceOf(process.env.PUBLIC_KEY!);

      console.log("You now own:", breadSlices.toString(), "slices of Bread!");
      expect(breadSlices.toString()).to.equal("10");
    });
  });
});
