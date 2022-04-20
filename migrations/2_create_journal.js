const PirateJournal = artifacts.require("PirateJournal");
const utils = require("../utils");
const config = require("../config");

module.exports = async function (deployer) {
  await utils.setup();
  const logFile = utils.read();

  await deployer.deploy(PirateJournal, config.pirateName, config.pirateSurname);

  const PJ = await PirateJournal.deployed();

  console.log("PirateJournal deployed at:", PJ.address);

  const PirateJournals = [
    {
      pirate: {
        name: config.pirateName,
        surname: config.pirateSurname,
      },
      address: PJ.address,
    },
  ];

  if (logFile.PirateJournals) {
    PirateJournals.push(logFile.PirateJournals.map((pj) => pj));
  }

  const data = {
    ...logFile,
    PirateJournals,
  };

  await utils.write(data);
};
