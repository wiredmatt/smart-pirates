const config = require("../config");
const fs = require("fs/promises");

const fname = `logs/deploy-${config.network}.log.json`;

module.exports = {
  setup: async () => {
    console.log("setting up");

    try {
      await fs.mkdir("logs");
    } catch (e) {
      // directory already existed
    }

    try {
      await fs.readFile(fname);
    } catch (e) {
      await fs.writeFile(fname, JSON.stringify({}));
    }

    return Promise.resolve();
  },
  read: () => {
    return require(`../${fname}`);
  },
  write: async (data) => {
    return await fs.writeFile(fname, JSON.stringify(data, null, 2), (e) =>
      console.log(e)
    );
  },
};
