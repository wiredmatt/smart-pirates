const fs = require("fs/promises");
const fname = __dirname + `/../logs/deploy-${process.env.NETWORK}.log.json`;

export default {
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
    return require(fname);
  },
  write: async (data: any) => {
    return await fs.writeFile(fname, JSON.stringify(data, null, 2), (e: any) =>
      console.log(e)
    );
  },
};
