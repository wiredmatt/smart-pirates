import { FC } from "react";

import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";

import { Avatar, IconLockClosed } from "degen";
import Button from "../Button";

import Metamask from "../../icons/metamask";
import {
  changeNetwork,
  formatAddress,
} from "../../utils/web3";
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

  const { data: ensNameData } = useEnsName({ address: accountData?.address });
  const { data: ensAvatarData } = useEnsAvatar({
    addressOrName: accountData?.address,
  });

  const isMounted = useIsMounted();

  return (
    <div>
      {accountData && isMounted ? (
        <div className="align-middle flex flex-row justify-around text-center space-x-5">
          <a href={`/pirate/${accountData.address}`}>
            <div className="transition hover:scale-110">
              <div className="align-middle flex flex-row justify-between space-x-4">
                <Avatar
                  src={
                    (ensAvatarData as any) ||
                    getRandomPirateAvatar(accountData.address!)
                  }
                  label="ENS Avatar"
                />
                <div>
                  <p className="font-bold text-xl">
                    {ensNameData
                      ? `${ensNameData} (${formatAddress(
                          accountData.address!
                        )})`
                      : formatAddress(accountData.address!)}
                  </p>
                  <p>
                    Connected to{" "}
                    {isMounted && accountData?.connector
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
                await changeNetwork(c.chains[0]);
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
