import { exec } from "child_process";

const tokens = {
  "0": "gold",
  "1": "stone",
  "2": "doubloon",
  "3": "bread",
  "4": "rum",
};

const sortedTokens = Object.keys(tokens)
  .sort()
  .map((k) => Object.values(tokens).at(parseInt(k)));

const goldMines = 5; // number of gold mines to open

const main = async () => {
  for (let i = 0; i < sortedTokens.length; i++) {
    await new Promise((resolve, reject) =>
      exec(
        `yarn hardhat create-${sortedTokens[i]} --network development`,
        (error, stdout, stederr) => {
          if (error) {
            console.log(`[deploy-${sortedTokens[i]}] - Error:`, error);
            reject(error);
          }

          if (stederr) {
            console.log(`[deploy-${sortedTokens[i]}] - Error:`, stederr);
            reject(stederr);
          }

          if (stdout) {
            console.log(`[deploy-${sortedTokens[i]}] - Status:`, stdout);
            setTimeout(() => {
              resolve(stdout);
            }, 500);
          }
        }
      )
    );
  }

  for (let i = 0; i < goldMines; i++) {
    await new Promise((resolve, reject) =>
      exec(
        `yarn hardhat open-gold-mine --network development`,
        (error, stdout, stederr) => {
          if (error) {
            console.log(`[open-gold-mine] - Error:`, error);
            reject(error);
          }

          if (stederr) {
            console.log(`[open-gold-mine] - Error:`, stederr);
            reject(stederr);
          }

          if (stdout) {
            console.log(`[open-gold-mine] - Status:`, stdout);
            setTimeout(() => {
              resolve(stdout);
            }, 500);
          }
        }
      )
    );
  }
};

main().catch((e) =>
  console.log("An error ocurred while deploying to blockchain:", e)
);
