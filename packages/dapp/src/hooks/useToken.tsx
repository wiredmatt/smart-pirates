import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { currencies, resources, Token } from "../utils/web3";

export const useToken = (token: Token) => {
  const { data: account } = useAccount();
  const [balance, setBalance] = useState<string>("0");
  const [name, setName] = useState<string>("Token");
  const [symbol, setSymbol] = useState<string>("TKN");
  const [icon, setIcon] = useState<string>("");
  const [description, setDescription] = useState<string>("A token");

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

            token.instance.on("Transfer", async (_, to, __, ___) => {
              if (to === account.address) {
                const balance = await token.balanceOf(account.address!);

                setBalance(balance.toString());
              }
            });
          }
        }
      } else {
        setBalance("0");
      }

      const name = await token.instance.name();
      const symbol = await token.instance.symbol();

      setName(name);
      setSymbol(symbol);

      setIcon(`/assets/tokens/${symbol}.png`);
      setDescription(token.description);
    })();

    return () => {};
  }, [account, token]);

  return { balance, name, symbol, icon, description };
};

export const useCurrency = (currency: "doubloon") => {
  return useToken(currencies[currency]);
};

export const useResource = (resource: "gold" | "stone") => {
  return useToken(resources[resource]);
};
