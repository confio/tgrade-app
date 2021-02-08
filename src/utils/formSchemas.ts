import { Bech32 } from "@cosmjs/encoding";
import * as Yup from "yup";

type DecodedAddress = {
  readonly prefix: string;
  readonly data: Uint8Array;
};

function getDecodedAddress(address?: string): DecodedAddress | null {
  try {
    return Bech32.decode(address || "");
  } catch {
    return null;
  }
}

function getAddressShape(addressPrefix: string) {
  return {
    address: Yup.string()
      .required("An address is required")
      .test(`is-valid-bech32`, `address must have valid bech32 format`, (address) => {
        const decodedAddress = getDecodedAddress(address);
        return !!decodedAddress;
      })
      .test(`has-valid-length`, `address must have 20 bytes of data`, (address) => {
        const decodedAddress = getDecodedAddress(address);
        return decodedAddress?.data.length === 20;
      })
      .test(`has-valid-prefix`, `address prefix must be "${addressPrefix}"`, (address) => {
        const decodedAddress = getDecodedAddress(address);
        return decodedAddress?.prefix === addressPrefix;
      }),
  };
}

export function getSearchValidationSchema(addressPrefix: string): Yup.AnyObjectSchema {
  return Yup.object().shape(getAddressShape(addressPrefix));
}

export function getSendAddressValidationSchema(addressPrefix: string): Yup.AnyObjectSchema {
  return Yup.object().shape(getAddressShape(addressPrefix));
}
