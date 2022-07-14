import { Typography } from "antd";
import connectIcon from "App/assets/icons/add-light.svg";
import keplrIcon from "App/assets/icons/keplr-logo.svg";
import ledgerIcon from "App/assets/icons/ledger-logo-light.svg";
import demoIcon from "App/assets/icons/tgrade-icon-light.svg";
import { ComponentProps } from "react";
import { useSdk } from "service";
import { SdkState } from "service/sdk";
import { isKeplrSigner, isLedgerSigner } from "utils/sdk";
import { ellipsifyAddress } from "utils/ui";

import Button from "../Button";
import Stack from "../Stack/style";
import StyledButtonConnectWallet from "./style";

const { Text } = Typography;

interface ButtonData {
  readonly imgSrc: string;
  readonly imgAlt: string;
  readonly buttonText: string;
}

function getButtonDataFromSdk({ address, signer }: SdkState): ButtonData {
  if (!(address && signer)) {
    return {
      imgSrc: connectIcon,
      imgAlt: "Connect wallet icon",
      buttonText: "Connect wallet",
    };
  }

  if (isKeplrSigner(signer)) {
    return {
      imgSrc: keplrIcon,
      imgAlt: "Keplr wallet icon",
      buttonText: ellipsifyAddress(address),
    };
  }

  if (isLedgerSigner(signer)) {
    return {
      imgSrc: ledgerIcon,
      imgAlt: "Ledger wallet icon",
      buttonText: ellipsifyAddress(address),
    };
  }

  return {
    imgSrc: demoIcon,
    imgAlt: "Demo wallet icon",
    buttonText: ellipsifyAddress(address),
  };
}

export default function ButtonConnectWallet(props: ComponentProps<typeof Button>): JSX.Element {
  const { sdkState } = useSdk();
  const { imgSrc, imgAlt, buttonText } = getButtonDataFromSdk(sdkState);

  return (
    <StyledButtonConnectWallet {...props}>
      <img src={imgSrc} alt={imgAlt} data-cy="main-menu-connect-wallet-icon" />
      <Stack gap="s-4">
        <Text>{buttonText}</Text>
      </Stack>
    </StyledButtonConnectWallet>
  );
}
