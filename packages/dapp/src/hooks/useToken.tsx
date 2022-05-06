import { formatEther } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { currencies, items, resources, Token } from "../utils/web3";

export const useToken = (token: Token, address?: string) => {
  const { data: account } = useAccount();
  const [balance, setBalance] = useState<string>("0");
  const [name, setName] = useState<string>("Token");
  const [symbol, setSymbol] = useState<string>("TKN");
  const [icon, setIcon] = useState<string>("");
  const [description, setDescription] = useState<string>("A token");
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const { connectors } = useConnect();

  useEffect(() => {
    (async () => {
      if (account?.address) {
        if (account.connector?.getProvider) {
          const provider = await account.connector?.getProvider();
          const signer = await account.connector?.getSigner();
          const chainId = await account.connector.getChainId();

          if (signer && chainId === connectors[0].chains[0].id) {
            await token.connect(provider, signer);

            const balance = await token.balanceOf(account.address);
            setBalance(balance.toString());

            token.instance.on("Transfer", async (from, to, __, ___) => {
              if (to === account.address || from === account.address) {
                const balance = await token.balanceOf(account.address!);

                setBalance(balance.toString());
              }
            });
          }
        }
      } else {
        setBalance("0");
      }

      try {
        const _exchangeRate = await token.exchangeRate();
        setExchangeRate(parseInt(_exchangeRate));
      } catch (e) {
        console.log("token doesn't have exchange rate defined");
      }

      const name = await token.instance.name();
      const symbol = await token.instance.symbol();

      setName(name);
      setSymbol(symbol);

      setIcon(`/assets/tokens/${symbol}.png`);
      setDescription(token.description);

      if (address) {
        if (token.provider) {
          token.connect(token.provider);
        }

        const balance = await token.balanceOf(address);

        setBalance(balance.toString());

        token.instance.on("Transfer", async (from, to, __, ___) => {
          if (to === address || from === address) {
            const balance = await token.balanceOf(address);
            setBalance(balance.toString());
          }
        });
      }
    })();

  }, [
    connectors,
    account,
    account?.address,
    account?.connector,
    token,
    address,
  ]);

  const allowance = async (address: string) => {
    const _allowance = await token.instance.allowance(
      account?.address,
      address
    );
    return _allowance.toString();
  };

  return {
    balance,
    name,
    symbol,
    icon,
    description,
    exchangeRate,
    allowance,
    address: token.address,
    decimals: token.decimals,
  };
};

export const useCurrency = (currency: "doubloon", address?: string) => {
  return useToken(currencies[currency], address);
};

export const useResource = (resource: "gold" | "stone", address?: string) => {
  return useToken(resources[resource], address);
};

export const useItem = (item: "bread" | "rum", address?: string) => {
  const _item = useToken(items[item], address);

  _item.balance = formatEther(_item.balance).toString();

  return _item;
};
