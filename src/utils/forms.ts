import { Bech32 } from "@cosmjs/encoding";
import { TFunction } from "i18next";
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

export function getAddressField(t: TFunction, addressPrefix: string, optional = false): any {
  const yupString = optional ? Yup.string() : Yup.string().required(t("form.address.required"));
  return yupString
    .test(`is-valid-bech32`, t("form.address.bech32"), (address) => {
      const decodedAddress = getDecodedAddress(address);
      return !!decodedAddress;
    })
    .test(`has-valid-prefix`, t("form.address.prefix", { addressPrefix }), (address) => {
      const decodedAddress = getDecodedAddress(address);
      return decodedAddress?.prefix === addressPrefix;
    })
    .test(`has-valid-length`, t("form.address.length"), (address) => {
      const decodedAddress = getDecodedAddress(address);
      return decodedAddress?.data.length === 20;
    });
}

export function getAmountField(t: TFunction, maxAmountNum?: number, maxAmountString?: string): any {
  const yupNumber = Yup.number().required(t("form.amount.required")).positive(t("form.amount.positive"));
  return !maxAmountNum || !maxAmountString
    ? yupNumber
    : yupNumber.max(maxAmountNum, t("form.amount.max", { maxAmountString }));
}
