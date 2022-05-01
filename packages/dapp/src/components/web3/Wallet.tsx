import { FC } from "react";

import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";

import { Avatar, Box, IconLockClosed, Skeleton, Stack } from "degen";
import Button from "../Button";

import Metamask from "../../icons/metamask";
import {
  changeNetwork,
  formatAddress,
  getRandomPirateAvatar,
} from "../../utils/web3";
import { useIsMounted } from "../../hooks/useIsMounted";

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
        <Stack
          align="center"
          direction={{ xs: "vertical", sm: "horizontal" }}
          justify="space-between"
        >
          <div className="transition hover:scale-110 cursor-pointer">
            <Stack
              align="center"
              direction={{ xs: "vertical", sm: "horizontal" }}
            >
              <Avatar
                src={
                  (ensAvatarData as any) ||
                  getRandomPirateAvatar(accountData.address!)
                }
                label="ENS Avatar"
              />
              <Stack space="0">
                <Box fontSize="large" textAlign={{ xs: "center", sm: "left" }}>
                  <p className="font-bold">
                    {ensNameData
                      ? `${ensNameData} (${formatAddress(
                          accountData.address!
                        )})`
                      : formatAddress(accountData.address!)}
                  </p>
                </Box>
                <Box
                  textAlign={{ xs: "center", sm: "left" }}
                  display="flex"
                  gap="1"
                >
                  <p>Connected to </p>
                  <Skeleton loading={!(isMounted && accountData?.connector)}>
                    <p>
                      {isMounted && accountData?.connector
                        ? accountData.connector.name
                        : "Wallet Name"}
                    </p>
                  </Skeleton>
                </Box>
              </Stack>
            </Stack>
          </div>

          <button onClick={() => disconnect()}>Disconnect</button>
        </Stack>
      ) : (
        <Stack align="flex-end">
          {connectors.map((c) => (
            <div className="font-lobster">
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
              >
                Connect {c.name} Wallet
              </Button>
            </div>
          ))}
        </Stack>
      )}
    </div>
  );
};

export default Account;
