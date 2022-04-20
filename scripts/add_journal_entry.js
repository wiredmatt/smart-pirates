const Web3 = require("web3");
const config = require("../config");
const Provider = require("@truffle/hdwallet-provider");

const main = async () => {
  // journal address, page, title, date, text
  if (process.argv.length < 7) {
    console.log(
      "Missing one of the following arguments: journal address | page | title | date | text "
    );
    return;
  }

  const contractAddress = process.argv[2];
  const page = process.argv[3];
  const title = process.argv[4];
  const date = process.argv[5];
  const text = process.argv[6];

  const provider = new Provider(config.privateKeyDev, "http://127.0.0.1:8545");

  const web3 = new Web3(provider);

  const Journal = new web3.eth.Contract(
    require("../build/contracts/PirateJournal.json").abi,
    contractAddress
  );

  const entry = await Journal.methods.recordEntry(parseInt(page), title, date, text).call();

  console.log("entry recorded to the journal");
  console.log(entry);

  return Promise.resolve();
};

main()
  .then(() => {
    console.log("done");
    process.exit(0);
  })
  .catch((e) => console.log(e));
