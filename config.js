require("dotenv").config();

module.exports = {
  privateKeyDev: process.env.PRIVATE_KEY_DEV,
  pirateName: process.env.PIRATE_NAME,
  pirateSurname: process.env.PIRATE_SURNAME,
  network: process.env.NETWORK
};
