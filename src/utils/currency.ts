import { Coin } from "@cosmjs/launchpad";
import { Decimal } from "@cosmjs/math";
import { useEffect, useState } from "react";
import { useSdk } from "service";

// NARROW NO-BREAK SPACE (U+202F)
const thinSpace = "\u202F";

export function printableCoin(coin?: Coin): string {
  if (!coin) {
    return "0";
  }
  if (coin.denom.startsWith("u")) {
    const ticker = coin.denom.slice(1).toUpperCase();
    return Decimal.fromAtomics(coin.amount, 6).toString() + thinSpace + ticker;
  } else {
    return coin.amount + thinSpace + coin.denom;
  }
}

export function printableBalance(balance?: readonly Coin[]): string {
  if (!balance || balance.length === 0) return "–";
  return balance.map(printableCoin).join(", ");
}

export interface MappedCoin {
  readonly denom: string;
  readonly fractionalDigits: number;
}

export interface CoinMap {
  readonly [key: string]: MappedCoin;
}

export function nativeCoinToDisplay(coin: Coin, coinMap: CoinMap): Coin {
  if (!coinMap) throw new Error("Coin map not found");

  const coinToDisplay = coinMap[coin.denom];
  if (!coinToDisplay) throw new Error("Coin not found in map");

  const amountToDisplay = Decimal.fromAtomics(coin.amount, coinToDisplay.fractionalDigits).toString();

  return { denom: coinToDisplay.denom, amount: amountToDisplay };
}

// display amount is eg "12.0346", return is in native tokens
// with 6 fractional digits, this would be eg. "12034600"
export function displayAmountToNative(
  amountToDisplay: string,
  coinMap: CoinMap,
  nativeDenom: string,
): string {
  const fractionalDigits = coinMap[nativeDenom]?.fractionalDigits;
  if (fractionalDigits) {
    const decimalAmount = Decimal.fromUserInput(amountToDisplay, fractionalDigits);
    return decimalAmount.atomics;
  }

  return amountToDisplay;
}

export function useBalance(address?: string): readonly Coin[] {
  const {
    sdkState: { getBalance },
  } = useSdk();
  const [currentBalance, setCurrentBalance] = useState<readonly Coin[]>([]);

  useEffect(() => {
    let mounted = true;

    (async function updateBalance() {
      const balance = await getBalance(address);
      if (mounted) setCurrentBalance(balance);
    })();

    return () => {
      mounted = false;
    };
  }, [address, getBalance]);

  return currentBalance;
}
