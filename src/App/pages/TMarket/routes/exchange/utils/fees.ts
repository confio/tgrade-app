import { Decimal } from "@cosmjs/math";
import { StdFee } from "@cosmjs/stargate";

/**
 * Creates a user friendly string representation of a utgd fee, such as "0.025 TGD".
 *
 * Note this is for displaying purposes only and can remove precision. E.g.
 * { amount: "333333", denom: "utgd" } becomes "0.3333 TGD".
 */
export function formatTgdFee(fee: StdFee): string {
  if (fee.amount.length !== 1) throw new Error("Only one coin supported in fee display");
  const coin = fee.amount[0];
  if (coin.denom !== "utgd") throw new Error("Only utgd denom supported");
  const [whole, fractional] = Decimal.fromAtomics(coin.amount, 6).toString().split(".");
  // Makes a large number with to many decimals shorter by truncating
  // Ex 0.0238454945350234 => 0.0238
  return `${whole}.${fractional.slice(0, 4)} TGD`;
}
