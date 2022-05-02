import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { currencies } from "../utils/web3";

const useToken = (currency: "doubloon") => {
  const { data: account } = useAccount();
  const [balance, setBalance] = useState<string>("0");
  const [name, setName] = useState<string>("Token");
  const [symbol, setSymbol] = useState<string>("TKN");

  useEffect(() => {
    (async () => {
      if (account?.address) {
        const provider = await account.connector?.getProvider();
        const signer = await account.connector?.getSigner();

        if (!signer) {
          return;
        }

        await currencies[currency].connect(provider, signer);

        const balance = await currencies.doubloon.balanceOf(account.address!);

        setBalance(balance.toString());

        const name = await currencies[currency].instance.name();
        const symbol = await currencies[currency].instance.symbol();

        setName(name);
        setSymbol(symbol);
      }
    })();
  }, [account]);

  return [balance, name, symbol];
};

export default useToken;
