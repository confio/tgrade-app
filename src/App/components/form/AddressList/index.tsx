import { Tag } from "antd";
import * as React from "react";
import { isValidAddress } from "utils/forms";
import { ellipsifyAddress } from "utils/ui";
import { AddressesContainer } from "./style";

interface AddressListProps {
  readonly addresses: readonly string[];
  readonly addressPrefix: string;
  readonly handleClose?: (address: string) => void;
}

export function AddressList({ addresses, addressPrefix, handleClose }: AddressListProps): JSX.Element | null {
  return addresses.length ? (
    <AddressesContainer>
      {addresses.map((address, index) => (
        <Tag
          key={`${index}-${address}`}
          color={isValidAddress(address, addressPrefix) ? "default" : "var(--color-error-form)"}
          closable={!!handleClose}
          onClose={() => handleClose?.(address)}
        >
          {ellipsifyAddress(address)}
        </Tag>
      ))}
    </AddressesContainer>
  ) : null;
}
