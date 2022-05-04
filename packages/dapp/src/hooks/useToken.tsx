import { useEffect, useState } from "react";
import { useAccount, useProvider } from "wagmi";
import { chains, currencies, items, resources, Token } from "../utils/web3";

export const useToken = (token: Token, address?: string) => {
  const { data: account } = useAccount();
  const [balance, setBalance] = useState<string>("0");
  const [name, setName] = useState<string>("Token");
  const [symbol, setSymbol] = useState<string>("TKN");
  const [icon, setIcon] = useState<string>("");
  const [description, setDescription] = useState<string>("A token");
  const [exchangeRate, setExchangeRate] = useState<number>(0);

  const _provider = useProvider({ chainId: chains[0].id }); // provider to use if user is not authenticated

  useEffect(() => {
    (async () => {
      if (account?.address) {
        if (account.connector?.getProvider) {
          const provider = await account.connector?.getProvider();
          const signer = await account.connector?.getSigner();

          if (signer) {
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
        console.log(e); // token doesn't have exchange rate defined
      }

      const name = await token.instance.name();
      const symbol = await token.instance.symbol();

      setName(name);
      setSymbol(symbol);

      setIcon(`/assets/tokens/${symbol}.png`);
      setDescription(token.description);

      if (address) {
        await token.connect(_provider);
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

    return () => {};
  }, [account, account?.address, token, _provider, address]);

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
  return useToken(items[item], address);
};
