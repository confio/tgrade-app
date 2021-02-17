import { Bech32 } from "@cosmjs/encoding";
import * as Yup from "yup";
// TODO: cleanup these types
import Lazy from "yup/lib/Lazy";
import { RequiredNumberSchema } from "yup/lib/number";
import { RequiredStringSchema } from "yup/lib/string";

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

export function getAddressField(
  addressPrefix: string,
): RequiredStringSchema<string | undefined, Record<string, any>> {
  return Yup.string()
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
    });
}

export function getContractField(
  addressPrefix: string,
): Lazy<
  | Yup.NumberSchema<number | undefined, Record<string, any>, number | undefined>
  | RequiredStringSchema<string | undefined, Record<string, any>>
> {
  return Yup.lazy((value) => {
    if (!Number.isNaN(Number(value))) return Yup.number().positive();
    return getAddressField(addressPrefix);
  });
}

export function getAmountField(): RequiredNumberSchema<number | undefined, Record<string, any>> {
  return Yup.number().required("An amount is required").positive("Amount should be positive");
}

export function getSearchAddressValidationSchema(addressPrefix: string): Yup.AnyObjectSchema {
  return Yup.object().shape({ address: getAddressField(addressPrefix) });
}

export function getSendAddressValidationSchema(addressPrefix: string): Yup.AnyObjectSchema {
  return Yup.object().shape({ address: getAddressField(addressPrefix) });
}

export function getCodeIdOrAddressValidationSchema(addressPrefix: string): Yup.AnyObjectSchema {
  return Yup.object().shape({ codeIdOrAddress: getContractField(addressPrefix) });
}

export function getAddAllowanceValidationSchema(addressPrefix: string): Yup.AnyObjectSchema {
  return Yup.object().shape({
    address: getAddressField(addressPrefix),
    amount: getAmountField(),
  });
}

export const setAllowanceValidationSchema = Yup.object().shape({ newAmount: getAmountField() });

export const createTokenValidationSchema = Yup.object().shape({
  symbol: Yup.string().required().strict().uppercase().min(3).max(6),
  tokenName: Yup.string().required().min(3).max(30),
  decimals: Yup.number().required().integer().min(0).max(18),
  initialSupply: Yup.number().required().positive(),
  mintCap: Yup.number().when("initialSupply", (initialSupply: number, schema: any) => {
    return schema.test({
      test: (mintCap?: number) => !mintCap || initialSupply <= mintCap,
      message: "Cap must be equal or greater than initial supply",
    });
  }),
});
