import copyToClipboard from "clipboard-copy";
import * as React from "react";
import { ComponentProps } from "react";
import { useSdk } from "service";
import { ellipsifyAddress } from "utils/ui";
import copyIcon from "../../assets/icons/copy.svg";
import StyledAddressTag from "./style";

function CopyIconImg() {
  return <img alt="Copy icon" src={copyIcon} />;
}

type AddressTagProps = ComponentProps<typeof StyledAddressTag> & {
  readonly address: string;
  readonly short?: boolean;
  readonly copyable?: boolean;
  readonly noYou?: boolean;
};

export default function AddressTag({
  address,
  short,
  copyable,
  noYou,
  ...restProps
}: AddressTagProps): JSX.Element {
  const {
    sdkState: { address: myAddress },
  } = useSdk();

  return (
    <StyledAddressTag
      icon={copyable ? <CopyIconImg /> : undefined}
      onClick={copyable ? () => copyToClipboard(address) : undefined}
      {...restProps}
    >
      {short ? ellipsifyAddress(address) : address}
      {myAddress === address && !noYou ? <span className="your-address">(you)</span> : null}
    </StyledAddressTag>
  );
}
