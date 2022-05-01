import { FC } from "react";

import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";

import { Avatar, Box, Button, IconLockClosed, Skeleton, Stack } from "degen";
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
    icon: <Metamask style={{ paddingTop: 8 }} key="metamask" />,
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

  if (accountData && isMounted)
    return (
      <Stack
        align="center"
        direction={{ xs: "vertical", sm: "horizontal" }}
        justify="space-between"
      >
        <Stack align="center" direction={{ xs: "vertical", sm: "horizontal" }}>
          <Avatar
            src={
              (ensAvatarData as any) ||
              getRandomPirateAvatar(accountData.address!)
            }
            label="ENS Avatar"
          />
          <Stack space="0">
            <Box fontSize="large" textAlign={{ xs: "center", sm: "left" }}>
              {ensNameData
                ? `${ensNameData} (${formatAddress(accountData.address!)})`
                : formatAddress(accountData.address!)}
            </Box>
            <Box
              fontSize="small"
              color="textSecondary"
              textAlign={{ xs: "center", sm: "left" }}
              display="flex"
              gap="1"
            >
              Connected to{" "}
              <Skeleton loading={!(isMounted && accountData?.connector)}>
                {isMounted && accountData?.connector
                  ? accountData.connector.name
                  : "Wallet Name"}
              </Skeleton>
            </Box>
          </Stack>
        </Stack>

        <Button variant="secondary" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </Stack>
    );

  return (
    <Stack align="flex-end">
      {connectors.map((c) => (
        <Button
          key={c.name}
          prefix={connectorProps.map((_c) =>
            _c.name.toLowerCase() === c.name.toLowerCase() ? (
              _c.icon
            ) : (
              <IconLockClosed key={c.name} />
            )
          )}
          variant="primary"
          width={{ xs: "full", md: "max" }}
          onClick={async () => {
            connect(c); // get permission to use metamask

            await changeNetwork(c.chains[0]);
          }}
        >
          Connect {c.name} Wallet {}
        </Button>
      ))}
    </Stack>
  );
};

export default Account;
