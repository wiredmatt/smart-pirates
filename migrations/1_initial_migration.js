const utils = require("../utils");

const Migrations = artifacts.require("Migrations");

module.exports = async function (deployer) {
  await deployer.deploy(Migrations);
  await utils.setup();
};
