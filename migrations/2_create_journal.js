const PirateJournal = artifacts.require("PirateJournal");
const utils = require("../utils");
const config = require("../config");
const Web3 = require("web3");
const Provider = require("@truffle/hdwallet-provider");

module.exports = async function (deployer) {
  await utils.setup();
  const logFile = utils.read();

  await deployer.deploy(PirateJournal, config.pirateName, config.pirateSurname);

  const provider = new Provider(config.privateKeyDev, "http://127.0.0.1:9545");

  const web3 = new Web3(provider);
  const PJ = await PirateJournal.deployed();

  const Journal = new web3.eth.Contract(
    require("../build/contracts/PirateJournal.json").abi,
    PJ.address
  );

  const author = await Journal.methods.author().call();

  console.log("PirateJournal deployed at:", PJ.address);

  const PirateJournals = [
    {
      pirate: {
        name: config.pirateName,
        surname: config.pirateSurname,
        publicKey: author[2],
      },
      journalAddress: PJ.address,
    },
  ];

  if (logFile.PirateJournals) {
    logFile.PirateJournals.forEach((pj) => PirateJournals.push(pj));
  }

  const data = {
    ...logFile,
    PirateJournals,
  };

  await utils.write(data);
};
