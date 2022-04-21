import * as dotenv from "dotenv";
dotenv.config();

import { HardhatUserConfig, task, types } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

import utils from "./utils";

import { parse, stringify } from "envfile";
import { writeFile } from "fs-extra";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

type PirateJournalJSON = {
  pirate: {
    name: string;
    surname: string;
  };
  journalAddress: string;
};

task(
  "set-keys",
  "Sets the private and public key of the pirate that's going to own the journal. Remember that you must keep your private key a secret!"
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

task("create-journal", "Creates a new Pirate Journal")
  .addPositionalParam(
    "name",
    "The name of the pirate",
    undefined,
    types.string,
    false
  )
  .addPositionalParam(
    "surname",
    "The surname of the pirate",
    undefined,
    types.string,
    false
  )
  .setAction(async ({ name, surname }, hre) => {
    await utils.setup();
    const logFile = utils.read();

    const Journal = await hre.ethers.getContractFactory("PirateJournal");
    const journal = await Journal.deploy(name, surname);

    await journal.deployed();

    console.log("New pirate Journal created at:", journal.address);

    const PirateJournals = [
      {
        pirate: {
          name: name,
          surname: surname,
          publickey: process.env.PUBLIC_KEY,
        },
        journalAddress: journal.address,
      },
    ];

    if (logFile.PirateJournals) {
      PirateJournals.push(
        logFile.PirateJournals.map((pj: PirateJournalJSON) => pj)
      );
    }

    const data = {
      ...logFile,
      PirateJournals,
    };

    await utils.write(data);
  });

task("record-entry", "Adds or modifies an entry in the journal")
  .addPositionalParam(
    "journaladdress",
    "The address of the journal",
    undefined,
    types.string,
    false
  )
  .addPositionalParam(
    "page",
    "The page in which this entry will be recorded",
    undefined,
    types.int,
    false
  )
  .addPositionalParam(
    "title",
    "The title for this entry",
    undefined,
    types.string,
    false
  )
  .addPositionalParam(
    "date",
    "The date for this entry",
    undefined,
    types.string,
    false
  )
  .addPositionalParam(
    "text",
    "The text for this entry",
    undefined,
    types.string,
    false
  )
  .setAction(async ({ journaladdress, page, title, date, text }, hre) => {
    const Journal = await hre.ethers.getContractFactory("PirateJournal");

    const journal = Journal.attach(journaladdress);

    const entry = await journal.recordEntry(page, title, date, text, {
      from: process.env.PUBLIC_KEY,
    });

    const receipt = await entry.wait();

    console.log(receipt);
  });

task("read", "Reads a page of the journal")
  .addPositionalParam(
    "journaladdress",
    "The address of the journal",
    undefined,
    types.string,
    false
  )
  .addPositionalParam(
    "page",
    "The page number to read",
    undefined,
    types.int,
    false
  )
  .setAction(async ({ journaladdress, page }, hre) => {
    const Journal = await hre.ethers.getContractFactory("PirateJournal");

    const journal = Journal.attach(journaladdress);
    const entry = await journal.readEntry(page);

    console.log(`${entry.title} - ${entry.date}\n`);
    console.log("--------------------");
    console.log(entry.text);
    console.log("--------------------");
  });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

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
};

export default config;
