import { toast } from "react-toastify";
import { Chain } from "wagmi";
import { ethers } from "ethers";

import GoldABI from "./contracts/abis/Gold.json";
import StoneABI from "./contracts/abis/Stone.json";
import DoubloonABI from "./contracts/abis/Doubloon.json";
import GoldMineABI from "./contracts/abis/GoldMine.json";
import BreadABI from "./contracts/abis/Bread.json";
import RumABI from "./contracts/abis/Rum.json";

import GoldData from "./contracts/data/Gold.json";
import StoneData from "./contracts/data/Stone.json";
import DoubloonData from "./contracts/data/Doubloon.json";
import GoldMinesData from "./contracts/data/GoldMines.json";
import BreadData from "./contracts/data/Bread.json";
import RumData from "./contracts/data/Rum.json";

export const chains: Chain[] = [
  {
    id: 1337,
    name: process.env.REACT_APP_BLOCKCHAIN || "development", // development | mumbai | Matic Mainnet
    rpcUrls: {
      default: process.env.REACT_APP_RPC || "http://localhost:8545", // http://localhost:8545 | https://matic-mumbai.chainstacklabs.com | https://polygon-rpc.com/
    },
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    blockExplorers: {
      default: {
        name: "default",
        url: process.env.REACT_APP_BLOCKEXPLORER || "",
      },
      etherscan: {
        name: "etherscan",
        url: process.env.REACT_APP_BLOCKEXPLORER || "",
      },
    },
  },
];

export const changeNetwork = async (chain: Chain) => {
  if (window.ethereum) {
    try {
      if (process.env.NODE_ENV === "development") {
        (window.ethereum as any).networkVersion !== "1337" &&
          toast.info(
            "[This message is only shown in development] Remember to switch manually to Localhost:8545 network. Switching automatically as with Mumbai doesn't work due to a metamask bug.",
            {
              autoClose: 10000,
              closeOnClick: true,
            }
          );
      } else {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: "0x" + chain.id.toString(16),
            },
          ],
        });
      }
    } catch (error) {
      try {
        console.log("adding chain");
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x" + chain.id.toString(16),
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: [chain.rpcUrls.default],
              blockExplorerUrls: [chain.blockExplorers?.default.url || ""],
            },
          ],
        });
      } catch (addError) {
        console.error(addError);
      }
      console.error(error);
    }
  } else {
    alert("Metamask not installed");
    return;
  }
};

export const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(36, 42)}`;
};

export const getRandomPirateAvatar = (address: string) => {
  let hash = 0,
    len = address.length;
  for (let i = 0; i < len; i++) {
    hash = (hash << 5) - hash + address.charCodeAt(i);
    hash |= 0; // to 32bit integer
  }

  let pirateId = hash.toString()[0];

  let pirateIcon = "/assets/pirates/" + pirateId + ".png";

  return pirateIcon;
};

export class SmartContract {
  name: string;
  abi: any;
  address: string;
  description: string; // tooltip text to show when user hovers over token

  instance: ethers.Contract;
  provider?: ethers.providers.Provider | ethers.providers.Web3Provider;
  signer?: ethers.Signer;

  constructor(
    _name: string,
    _abi: any,
    _address: string,
    _description: string,
    _provider?: ethers.providers.Web3Provider | undefined,
    _signer?: ethers.Signer
  ) {
    this.name = _name;
    this.abi = _abi;
    this.address = _address;
    this.description = _description;
    this.provider =
      _provider ||
      new ethers.providers.JsonRpcProvider(undefined, {
        chainId: 1337,
        name: "development",
      });
    this.signer = _signer;

    this.instance = new ethers.Contract(
      _address,
      _abi,
      this.signer || this.provider
    );
  }

  async connect(provider: ethers.providers.Provider, signer: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
    this.instance = new ethers.Contract(this.address, this.abi, this.signer);
  }
}

export class GoldMine extends SmartContract {
  async spotsCount(): Promise<number> {
    const bn = await this.instance.spotsCount();
    return parseInt(bn.toString());
  }

  async explorationFee(): Promise<string> {
    const fee = await this.instance.EXPLORATION_FEE();
    return fee.toString();
  }

  async lookForGold(spot: number): Promise<boolean> {
    if (!this.provider) throw Error("Provider not provided");
    if (!this.signer) throw Error("Signer not provided");

    const fee = await this.explorationFee();

    const tx = await this.instance.lookForGold(spot, {
      value: fee,
    });

    const result = await tx.wait();

    const event = result.events?.find((e: any) => e.event === "FoundAsset");

    if (event?.args) {
      const [, isGold] = event?.args;

      return isGold;
    } else {
      throw Error("Tx not sent");
    }
  }
}

export class Token extends SmartContract {
  async balanceOf(address: string) {
    return await this.instance.balanceOf(address);
  }

  async approve(amount: number, address: string) {
    if (!this.provider) throw Error("Provider not provided");
    if (!this.signer) throw Error("Signer not provided");

    return await this.instance.approve(address, amount);
  }

  async exchangeRate() {
    try {
      const rate = await this.instance.EXCHANGE_RATE();
      return rate.toString();
    } catch (e) {
      return "0";
    }
  }
}

export class Item extends Token {
  doubloon: Token;

  constructor(
    _name: string,
    _abi: any,
    _address: string,
    _description: string,
    _doubloon: Token,
    _provider?: ethers.providers.Web3Provider | undefined,
    _signer?: ethers.Signer
  ) {
    super(_name, _abi, _address, _description, _provider, _signer);
    this.doubloon = _doubloon;
  }

  async getPrice() {
    return await this.instance.EXCHANGE_RATE();
  }

  async approveTrade(amount: number) {
    await this.doubloon.approve(amount, this.address); // approves sending DBL from user wallet to the merchant
  }

  async buy() {
    return await this.instance.methods.buy();
  }
}

export const resources = {
  gold: new Token(
    "Gold",
    GoldABI,
    GoldData.address,
    "Gold, a resource that can be found in Gold mines and exchanged for Doubloons"
  ),
  stone: new Token(
    "Stone",
    StoneABI,
    StoneData.address,
    "Stone, a resource found in mines, quite useless"
  ),
};

export const currencies = {
  doubloon: new Token(
    "Doubloon",
    DoubloonABI,
    DoubloonData.address,
    "Doubloon, the main currency used by pirates, with it you can buy anything you'd like from The Tavern"
  ),
};

export const items: Item[] = [
  new Item(
    "Bread",
    BreadABI,
    BreadData.address,
    "Looks edible...",
    currencies.doubloon
  ),
  new Item(
    "Rum",
    RumABI,
    RumData.address,
    "Getting drunk might make your journey easier, you might finish it sooner than you thought thanks to it! (Definitely not because you'd be more likely to die)",
    currencies.doubloon
  ),
];

export const GoldMines: GoldMine[] = GoldMinesData.map(
  (gm, i) =>
    new GoldMine(
      `GoldMine #${i + 1} ${formatAddress(gm)}`,
      GoldMineABI,
      gm,
      "A mine in which you can find gold"
    )
);

export const part = <T>(a: T[], n: number): T[][] => {
  const b = Math.ceil(a.length / n);
  return [...Array(n)].map((_, i) => a.slice(i * b, (i + 1) * b));
};
