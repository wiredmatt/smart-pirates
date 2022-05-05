import { FC, useEffect, useState } from "react";

import { useAccount, useConnect, useDisconnect } from "wagmi";

import { Avatar, IconLockClosed } from "degen";
import Button from "../Button";

import Metamask from "../../icons/metamask";
import { changeNetwork, formatAddress } from "../../utils/web3";
import { useIsMounted } from "../../hooks/useIsMounted";
import { getRandomPirateAvatar } from "../../utils/web3/pirateGenerator";

interface IProps {}

const connectorProps = [
  {
    name: "metamask",
    icon: <Metamask style={{ paddingBottom: 2 }} key="metamask" />,
  },
];

const Account: FC<IProps> = () => {
  const { data: accountData } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const isMounted = useIsMounted();

  const [requested, setRequested] = useState(false);

  useEffect(() => {
    const checkNetwork = async () => {
      setRequested(true);
      if (window.ethereum) {
        const currentChainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        if (currentChainId !== connectors[0].chains[0] && !requested) {
          throw Error("Wrong Network");
        }
      }
    };

    if (accountData?.address) {
      checkNetwork().catch(async () => {
        !requested && (await changeNetwork(connectors[0].chains[0]));
      });
    }
  }, [accountData, connectors, requested]);

  return (
    <div>
      {accountData && isMounted ? (
        <div className="align-middle flex flex-row justify-around text-center space-x-5">
          <a href={`/pirate/${accountData.address}`}>
            <div className="transition hover:scale-110">
              <div className="align-middle flex flex-row justify-between space-x-4">
                <Avatar
                  src={getRandomPirateAvatar(accountData.address!)}
                  label="ENS Avatar"
                />
                <div>
                  <p className="font-bold text-xl">
                    {formatAddress(accountData.address!)}
                  </p>
                  <p>
                    Connected to{" "}
                    {accountData?.connector
                      ? accountData.connector.name
                      : "Unknown wallet"}
                  </p>
                </div>
              </div>
            </div>
          </a>

          <Button
            bgColor={"bg-black"}
            textColor={"text-white"}
            onClick={() => disconnect()}
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <div>
          {connectors.map((c) => (
            <Button
              key={c.name}
              onClick={async () => {
                connect(c); // get permission to use metamask
              }}
              leftIcon={
                connectorProps.find(
                  (_c) => _c.name.toLowerCase() === c.name.toLowerCase()
                )?.icon || <IconLockClosed key={c.name} />
              }
              bgColor={"bg-black"}
              textColor={"text-white"}
            >
              Connect {c.name} Wallet
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Account;
