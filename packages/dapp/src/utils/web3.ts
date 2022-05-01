import { toast } from "react-toastify";
import { Chain } from "wagmi";

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
              chainId: "0x" + new Number(chain.id).toString(16),
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
              chainId: "0x" + new Number(chain.id).toString(16),
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
  return `${address.slice(0, 6)}…${address.slice(38, 42)}`;
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
