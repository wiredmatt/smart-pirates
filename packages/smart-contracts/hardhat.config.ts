import * as dotenv from "dotenv";
dotenv.config();

import { HardhatUserConfig, task, types } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-abi-exporter";

import utils from "./utils";

import { parse, stringify } from "envfile";
import { writeFile, mkdirp, writeJSON } from "fs-extra";

const abisDir = `${__dirname}/../dapp/src/utils/web3/contracts/abis`;
const tokensDir = `${__dirname}/../dapp/src/utils/web3/contracts/data`;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task(
  "set-keys",
  "Sets the private and public key of the pirate that's going to manage the contracts. Remember that you must keep your private key a secret!"
)
  .addPositionalParam(
    "privatekey",
    "The private key of the pirate",
    undefined,
    types.string,
    false
  )
  .addPositionalParam(
    "publickey",
    "The public key of the pirate",
    undefined,
    types.string,
    false
  )
  .setAction(async ({ privatekey, publickey }, _) => {
    const env = parse(".env");

    env.PRIVATE_KEY = privatekey;
    env.PUBLIC_KEY = publickey;

    await writeFile(".env", stringify(env));
  });

task("create-gold", "Creates Gold").setAction(async (_, hre) => {
  await utils.setup();
  const logFile = utils.read();

  const Gold = await hre.ethers.getContractFactory("Gold");
  const gold = await Gold.deploy();

  await gold.deployed();

  console.log("Gold deployed to:", gold.address);

  logFile.Gold = {
    address: gold.address,
  };

  await utils.write(logFile);

  await mkdirp(tokensDir);

  await writeJSON(`${tokensDir}/Gold.json`, logFile.Gold, {
    spaces: 2,
  });
});

task("create-doubloon", "Creates Doubloon").setAction(async (_, hre) => {
  await utils.setup();
  const logFile = utils.read();

  if (!logFile.Gold) {
    console.log("Deploy Gold first!");
    return;
  }

  const Doubloon = await hre.ethers.getContractFactory("Doubloon");
  const doubloon = await Doubloon.deploy(logFile.Gold.address);

  await doubloon.deployed();

  console.log("Doubloon deployed to:", doubloon.address);

  logFile.Doubloon = {
    address: doubloon.address,
  };

  await utils.write(logFile);

  const gold = await hre.ethers.getContractAt("Gold", logFile.Gold.address);

  await gold.setDoubloonMaker(doubloon.address);

  await mkdirp(tokensDir);

  await writeJSON(`${tokensDir}/Doubloon.json`, logFile.Doubloon, {
    spaces: 2,
  });
});

task("create-stone", "Creates Stone").setAction(async (_, hre) => {
  await utils.setup();
  const logFile = utils.read();

  const Stone = await hre.ethers.getContractFactory("Stone");
  const stone = await Stone.deploy();

  await stone.deployed();

  console.log("Stone deployed to:", stone.address);

  logFile.Stone = {
    address: stone.address,
  };

  await utils.write(logFile);

  await mkdirp(tokensDir);

  await writeJSON(`${tokensDir}/Stone.json`, logFile.Stone, {
    spaces: 2,
  });
});

const generateRandomSpots = (size: number): boolean[] => {
  let spots: boolean[] = new Array<boolean>(size);

  for (let i = 0; i < size; i++) {
    spots[i] = Math.random() < 0.5;
  }

  return spots;
};

task("open-gold-mine", "Opens a gold mine to find gold!").setAction(
  async (_, hre) => {
    await utils.setup();
    const logFile = utils.read();

    if (!logFile.Stone || !logFile.Gold) {
      console.log("Deploy Gold and Stone first!");
    }

    const spots = generateRandomSpots(10);

    const GoldMine = await hre.ethers.getContractFactory("GoldMine");
    const goldMine = await GoldMine.deploy(
      logFile.Gold.address,
      logFile.Stone.address,
      spots
    );

    await goldMine.deployed();

    console.log("New GoldMine deployed to:", goldMine.address);

    if (logFile.GoldMines) {
      logFile.GoldMines = [...logFile.GoldMines, goldMine.address];
    } else {
      logFile.GoldMines = [goldMine.address];
    }

    const gold = await hre.ethers.getContractAt("Gold", logFile.Gold.address);
    const goldAllowTx = await gold.allowGoldMine(goldMine.address);
    goldAllowTx.wait();

    const stone = await hre.ethers.getContractAt(
      "Stone",
      logFile.Stone.address
    );
    const stoneAllowTx = await stone.allowGoldMine(goldMine.address);
    stoneAllowTx.wait();

    await utils.write(logFile);

    await mkdirp(tokensDir);

    await writeJSON(`${tokensDir}/GoldMines.json`, logFile.GoldMines, {
      spaces: 2,
    });
  }
);

task("look-for-gold", "Looks for gold in given Spot, in a given Gold Mine")
  .addPositionalParam(
    "mine",
    "The address of a Gold Mine",
    undefined,
    types.string,
    false
  )
  .addPositionalParam(
    "spot",
    "The spot in where to look for some gold (or stones)",
    undefined,
    types.int,
    false
  )
  .setAction(async ({ mine, spot }, hre) => {
    await utils.setup();
    const logFile = utils.read();

    if (!logFile.GoldMines) {
      console.log("There are not Gold Mines yet");
    }

    const goldMine = await hre.ethers.getContractAt("GoldMine", mine);

    const exploration_fee = await goldMine.EXPLORATION_FEE();

    const found = await goldMine.lookForGold(spot, { value: exploration_fee });

    const tx = await found.wait();

    const event = tx.events?.find((event: any) => event.event === "FoundAsset");

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
  });

task("make-doubloons", "Give your gold, receive doubloons")
  .addPositionalParam(
    "amount",
    "The amount of gold to melt",
    undefined,
    types.int,
    false
  )
  .setAction(async ({ amount }, hre) => {
    await utils.setup();
    const logFile = utils.read();

    if (!logFile.Gold || !logFile.Doubloon) {
      console.log("Deploy gold and Doubloon first");
      return;
    }

    const doubloon = await hre.ethers.getContractAt(
      "Doubloon",
      logFile.Doubloon.address
    );

    const gold = await hre.ethers.getContractAt("Gold", logFile.Gold.address);

    const approveTx = await gold.approve(doubloon.address, amount);
    await approveTx.wait();

    await doubloon.makeDoubloon(amount);

    const doubloons = await doubloon.balanceOf(process.env.PUBLIC_KEY!);

    console.log("You now own $DBL", doubloons.toString());
  });

task("create-bread", "Creates Bread").setAction(async (_, hre) => {
  await utils.setup();
  const logFile = utils.read();

  if (!logFile.Doubloon) {
    console.log("Deploy Doubloon first");
    return;
  }

  const Bread = await hre.ethers.getContractFactory("Bread");
  const bread = await Bread.deploy(
    logFile.Doubloon.address,
    process.env.BAKER!
  );

  await bread.deployed();

  console.log("Bread deployed to:", bread.address);

  logFile.Bread = {
    address: bread.address,
  };

  await utils.write(logFile);

  await mkdirp(tokensDir);

  await writeJSON(`${tokensDir}/Bread.json`, logFile.Bread, {
    spaces: 2,
  });
});

task("create-rum", "Creates Rum").setAction(async (_, hre) => {
  await utils.setup();
  const logFile = utils.read();

  if (!logFile.Doubloon) {
    console.log("Deploy Doubloon first");
    return;
  }

  const Rum = await hre.ethers.getContractFactory("Rum");
  const rum = await Rum.deploy(
    logFile.Doubloon.address,
    process.env.BAR_OWNER!
  );

  await rum.deployed();

  console.log("Rum deployed to:", rum.address);

  logFile.Rum = {
    address: rum.address,
  };

  await utils.write(logFile);

  await mkdirp(tokensDir);

  await writeJSON(`${tokensDir}/Rum.json`, logFile.Rum, {
    spaces: 2,
  });
});

task("buy-bread", "Give your doubloons, receive bread")
  .addPositionalParam(
    "amount",
    "The amount of doubloons you offer for bread",
    undefined,
    types.int,
    false
  )
  .setAction(async ({ amount }, hre) => {
    await utils.setup();
    const logFile = utils.read();

    if (!logFile.Bread) {
      console.log("Deploy Bread first");
      return;
    }

    const doubloon = await hre.ethers.getContractAt(
      "Doubloon",
      logFile.Doubloon.address
    );

    const bread = await hre.ethers.getContractAt(
      "Bread",
      logFile.Bread.address
    );

    const approveTx = await doubloon.approve(bread.address, amount);
    await approveTx.wait();

    await bread.buy(amount);

    const breadSlices = await bread.balanceOf(process.env.PUBLIC_KEY!);

    console.log("You now own:", breadSlices.toString(), "slices of Bread!");
    console.log("-----------------\n");
    console.log(
      "Now that you're fed, and have some coin on, you can continue your journey!"
    );
  });

task("buy-Rum", "Give your doubloons, receive Rum")
  .addPositionalParam(
    "amount",
    "The amount of doubloons you offer for Rum",
    undefined,
    types.int,
    false
  )
  .setAction(async ({ amount }, hre) => {
    await utils.setup();
    const logFile = utils.read();

    if (!logFile.Rum) {
      console.log("Deploy Rum first");
      return;
    }

    const doubloon = await hre.ethers.getContractAt(
      "Doubloon",
      logFile.Doubloon.address
    );

    const rum = await hre.ethers.getContractAt("Rum", logFile.Rum.address);

    const approveTx = await doubloon.approve(rum.address, amount);
    await approveTx.wait();

    await rum.buy(amount);

    const RumSlices = await rum.balanceOf(process.env.PUBLIC_KEY!);

    console.log("You now own:", RumSlices.toString(), "bottles of Rum!");
    console.log("-----------------\n");
    console.log(
      "Now that you're fed and drunk, and have some coin on, you can continue your journey!"
    );
  });

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    hardhat: {
      chainId: 1337,
    },
    development: {
      chainId: 1337,
      from: process.env.PRIVATE_KEY,
      url: "http://localhost:8545",
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  abiExporter: {
    path: abisDir,
    runOnCompile: true,
    clear: true,
    flat: true,
    spacing: 2,
    pretty: true,
    except: ["@openzeppelin"],
  },
};

export default config;
