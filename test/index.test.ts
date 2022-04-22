import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import {
  Doubloon,
  Doubloon__factory,
  Gold,
  GoldMine,
  GoldMine__factory,
  Gold__factory,
  Stone,
  Stone__factory,
} from "../typechain";

const generateRandomSpots = (size: number): boolean[] => {
  let spots: boolean[] = new Array<boolean>(size);

  for (let i = 0; i < size; i++) {
    spots[i] = Math.random() < 0.5;
  }

  return spots;
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

  let add1: SignerWithAddress;
  let add2: SignerWithAddress;
  let add3: SignerWithAddress;
  let add4: SignerWithAddress;
  let addrs: SignerWithAddress;

  beforeEach(async () => {
    [add1, add2, add3, add4, addrs] = await ethers.getSigners();

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
  });

  describe(`Resources mining`, () => {
    it("Should allow a Gold Mine", async () => {
      await gold.allowGoldMine(goldMine.address);
      await stone.allowGoldMine(goldMine.address);

      const allowedGold = await gold.allowedMines(goldMine.address);
      const allowedStone = await gold.allowedMines(goldMine.address);

      expect(allowedGold, "Mine was not allowed for gold").to.equal(true);
      expect(allowedStone, "Mine was not allowed for stone").to.equal(true);
    });

    it("Should mine gold or stone from a Gold Mine", async () => {
      await gold.allowGoldMine(goldMine.address);
      await stone.allowGoldMine(goldMine.address);

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
      await gold.allowGoldMine(goldMine.address);
      await stone.allowGoldMine(goldMine.address);

      const exploration_fee = await goldMine.EXPLORATION_FEE();

      const getGold = async (spot: number): Promise<boolean> => {
        const found = await goldMine.lookForGold(spot, {
          value: exploration_fee,
        });

        const tx = await found.wait();

        const event = tx.events?.find((event) => event.event === "FoundAsset");

        if (event?.args) {
          const [_, isGold] = event?.args;

          if (isGold) {
            console.log("You found Gold!");
            console.log("+1 Gold ingot");
            return true;
          } else {
            console.log("You found... Stone!?");
            console.log("+100 stones");
            return false;
          }
        } else {
          return false;
        }
      };

      let _found = false;
      let spot = 0;

      while (!_found) {
        _found = await getGold(spot);
        spot++;
      }

      await gold.setDoubloonMaker(doubloon.address);

      const approveTx = await gold.approve(doubloon.address, 1);
      await approveTx.wait();

      const makeTx = await doubloon.makeDoubloon(1);
      await makeTx.wait();

      const doubloons = await doubloon.balanceOf(process.env.PUBLIC_KEY!);

      console.log("You now own $DBL", doubloons.toString());
    });
  });
});
