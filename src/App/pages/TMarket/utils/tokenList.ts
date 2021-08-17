import { PairProps, TokenProps } from "utils/tokens";

export const getTokensList = (
  tokens: { [key: string]: TokenProps },
  searchText: string | undefined,
): TokenProps[] => {
  let result: TokenProps[];
  if (!searchText) {
    result = Object.keys(tokens).map((k) => tokens[k]);
  } else {
    result = Object.keys(tokens)
      .map((k) => tokens[k])
      .filter(
        (t) =>
          t.name.toLowerCase().search(searchText.toLowerCase()) !== -1 ||
          t.symbol.toLowerCase().search(searchText.toLowerCase()) !== -1,
      );
  }
  return result;
};
export const getLPTokensList = (
  tokens: { [key: string]: { token: TokenProps; pair: PairProps } },
  searchText: string | undefined,
): TokenProps[] => {
  let result: TokenProps[];
  if (!searchText) {
    result = Object.keys(tokens).map((addr) => tokens[addr].token);
  } else {
    result = Object.keys(tokens)
      .map((addr) => tokens[addr].token)
      .filter(
        (t) =>
          t.name.toLowerCase().search(searchText.toLowerCase()) !== -1 ||
          t.symbol.toLowerCase().search(searchText.toLowerCase()) !== -1,
      );
  }
  return result;
};
