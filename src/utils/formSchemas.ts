import * as Yup from "yup";

function getRegexStartsWithPrefix(addressPrefix: string) {
  return new RegExp(`^${addressPrefix}`);
}

function getAddressShape(addressPrefix: string) {
  return {
    address: Yup.string()
      .required("An address is required")
      .matches(getRegexStartsWithPrefix(addressPrefix), `"${addressPrefix}" prefix required`)
      .length(39 + addressPrefix.length, "Address invalid"),
  };
}

export function getSearchValidationSchema(addressPrefix: string): Yup.AnyObjectSchema {
  return Yup.object().shape(getAddressShape(addressPrefix));
}

export function getSendAddressValidationSchema(addressPrefix: string): Yup.AnyObjectSchema {
  return Yup.object().shape(getAddressShape(addressPrefix));
}
