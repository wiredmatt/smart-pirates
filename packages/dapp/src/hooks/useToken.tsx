import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { currencies, resources } from "../utils/web3";

export const useCurrency = (currency: "doubloon") => {
  const { data: account } = useAccount();
  const [balance, setBalance] = useState<string>("0");
  const [name, setName] = useState<string>("Token");
  const [symbol, setSymbol] = useState<string>("TKN");
  const [icon, setIcon] = useState<string>("");
  const [description, setDescription] = useState<string>("A token");

  useEffect(() => {
    (async () => {
      if (account?.address) {
        const provider = await account.connector?.getProvider();
        const signer = await account.connector?.getSigner();

        if (!signer) {
          return;
        }

        await currencies[currency].connect(provider, signer);

        const balance = await currencies[currency].balanceOf(account.address!);

        setBalance(balance.toString());

        const name = await currencies[currency].instance.name();
        const symbol = await currencies[currency].instance.symbol();

        setName(name);
        setSymbol(symbol);
        setIcon(`/assets/tokens/${symbol}.png`);
        setDescription(currencies[currency].description);
      }
    })();
  }, [account, currency]);

  return { balance, name, symbol, icon, description };
};

export const useResource = (resource: "gold" | "stone") => {
  const { data: account } = useAccount();
  const [balance, setBalance] = useState<string>("0");
  const [name, setName] = useState<string>("Token");
  const [symbol, setSymbol] = useState<string>("TKN");
  const [icon, setIcon] = useState<string>("/assets/token/placeholder.png");
  const [description, setDescription] = useState<string>("A token");

  useEffect(() => {
    (async () => {
      if (account?.address) {
        const provider = await account.connector?.getProvider();
        const signer = await account.connector?.getSigner();

        if (!signer) {
          return;
        }

        await resources[resource].connect(provider, signer);

        const balance = await resources[resource].balanceOf(account.address!);

        setBalance(balance.toString());

        const name = await resources[resource].instance.name();
        const symbol = await resources[resource].instance.symbol();

        setName(name);
        setSymbol(symbol);
        setIcon(`/assets/tokens/${symbol}.png`);
        setDescription(resources[resource].description);
      }
    })();
  }, [account, resource]);

  return { balance, name, symbol, icon, description };
};
