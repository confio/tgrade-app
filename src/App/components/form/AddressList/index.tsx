import { AddressTag } from "App/components/logic";
import * as React from "react";
import { isValidAddress } from "utils/forms";
import StyledAddressList from "./style";

function getTagColor(address: string, addressPrefix?: string): string {
  if (!addressPrefix) return "default";
  if (isValidAddress(address, addressPrefix)) return "default";
  return "var(--color-error-form)";
}

interface AddressListProps {
  readonly addresses?: readonly string[];
  readonly addressPrefix?: string;
  readonly handleClose?: (address: string) => void;
  readonly short?: boolean;
  readonly copyable?: boolean;
}

export default function AddressList({
  addresses,
  addressPrefix,
  handleClose,
  short,
  copyable,
}: AddressListProps): JSX.Element | null {
  return addresses?.length ? (
    <StyledAddressList>
      {addresses.map((address, index) => (
        <AddressTag
          address={address}
          short={short}
          copyable={copyable}
          key={`${index}-${address}`}
          color={getTagColor(address, addressPrefix)}
          closable={!!handleClose}
          onClose={() => handleClose?.(address)}
        />
      ))}
    </StyledAddressList>
  ) : null;
}
