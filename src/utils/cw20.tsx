import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Coin } from "@cosmjs/stargate";

export interface BalanceResponse {
  readonly balance: string;
}

export type Expiration =
  | { readonly at_height: number }
  | { readonly at_time: number }
  | { readonly never: unknown };

export interface AllowanceResponse {
  readonly allowance: string; // integer as string
  readonly expires: Expiration;
}

export interface AllowanceInfo {
  readonly allowance: string; // integer as string
  readonly spender: string; // bech32 address
  readonly expires: Expiration;
}

export interface AllAllowancesResponse {
  readonly allowances: readonly AllowanceInfo[];
}

export interface AllAccountsResponse {
  // list of bech32 address that have a balance
  readonly accounts: readonly string[];
}

export interface TokenInfoResponse {
  readonly name: string;
  readonly symbol: string;
  readonly decimals: number;
  readonly total_supply: string;
}

export interface InvestmentResponse {
  readonly exit_tax: string;
  readonly min_withdrawal: string;
  readonly nominal_value: string;
  readonly owner: string;
  readonly staked_tokens: Coin;
  readonly token_supply: string;
  readonly validator: string;
}

export interface Claim {
  readonly amount: string;
  readonly release_at: { readonly at_time: number };
}

export interface ClaimsResponse {
  readonly claims: readonly Claim[];
}

export interface MinterResponse {
  readonly minter: string;
  readonly cap?: string;
}

export interface CW20Instance {
  readonly contractAddress: string;

  // queries
  balance: (address: string) => Promise<string>;
  allowance: (owner: string, spender: string) => Promise<AllowanceResponse>;
  allAllowances: (owner: string, startAfter?: string, limit?: number) => Promise<readonly AllowanceInfo[]>;
  allAccounts: (startAfter?: string, limit?: number) => Promise<readonly string[]>;
  tokenInfo: () => Promise<TokenInfoResponse>;
  investment: () => Promise<InvestmentResponse>;
  claims: (address: string) => Promise<readonly Claim[]>;
  minter: (sender: string) => Promise<MinterResponse>;

  // actions
  mint: (sender: string, recipient: string, amount: string) => Promise<string>;
  transfer: (sender: string, recipient: string, amount: string) => Promise<string>;
  burn: (sender: string, amount: string) => Promise<string>;
  increaseAllowance: (sender: string, recipient: string, amount: string) => Promise<string>;
  decreaseAllowance: (sender: string, recipient: string, amount: string) => Promise<string>;
  transferFrom: (sender: string, owner: string, recipient: string, amount: string) => Promise<string>;
  bond: (sender: string, coin: Coin) => Promise<string>;
  unbond: (sender: string, amount: string) => Promise<string>;
  claim: (sender: string) => Promise<string>;
}

export interface CW20Contract {
  use: (contractAddress: string) => CW20Instance;
}

export const CW20 = (client: SigningCosmWasmClient): CW20Contract => {
  const use = (contractAddress: string): CW20Instance => {
    const balance = async (address: string): Promise<string> => {
      const balanceQuery = { balance: { address } };
      const { balance }: BalanceResponse = await client.queryContractSmart(contractAddress, balanceQuery);
      return balance;
    };

    const allowance = (owner: string, spender: string): Promise<AllowanceResponse> => {
      const allowanceQuery = { allowance: { owner, spender } };
      return client.queryContractSmart(contractAddress, allowanceQuery);
    };

    const allAllowances = async (
      owner: string,
      startAfter?: string,
      limit?: number,
    ): Promise<readonly AllowanceInfo[]> => {
      const allAllowancesQuery = { all_allowances: { owner, start_after: startAfter, limit } };
      const { allowances }: AllAllowancesResponse = await client.queryContractSmart(
        contractAddress,
        allAllowancesQuery,
      );
      return allowances;
    };

    const allAccounts = async (startAfter?: string, limit?: number): Promise<readonly string[]> => {
      const allAccountsQuery = { all_accounts: { start_after: startAfter, limit } };
      const { accounts }: AllAccountsResponse = await client.queryContractSmart(
        contractAddress,
        allAccountsQuery,
      );
      return accounts;
    };

    const tokenInfo = (): Promise<TokenInfoResponse> => {
      return client.queryContractSmart(contractAddress, { token_info: {} });
    };

    const investment = (): Promise<InvestmentResponse> => {
      return client.queryContractSmart(contractAddress, { investment: {} });
    };

    const claims = async (address: string): Promise<readonly Claim[]> => {
      const claimsQuery = { claims: { address } };
      const { claims }: ClaimsResponse = await client.queryContractSmart(contractAddress, claimsQuery);
      return claims;
    };

    const minter = (): Promise<MinterResponse> => {
      return client.queryContractSmart(contractAddress, { minter: {} });
    };

    // mints tokens, returns transactionHash
    const mint = async (sender: string, recipient: string, amount: string): Promise<string> => {
      const result = await client.execute(sender, contractAddress, { mint: { recipient, amount } });
      return result.transactionHash;
    };

    // transfers tokens, returns transactionHash
    const transfer = async (sender: string, recipient: string, amount: string): Promise<string> => {
      const result = await client.execute(sender, contractAddress, { transfer: { recipient, amount } });
      return result.transactionHash;
    };

    // burns tokens, returns transactionHash
    const burn = async (sender: string, amount: string): Promise<string> => {
      const result = await client.execute(sender, contractAddress, { burn: { amount } });
      return result.transactionHash;
    };

    const increaseAllowance = async (sender: string, spender: string, amount: string): Promise<string> => {
      const result = await client.execute(sender, contractAddress, {
        increase_allowance: { spender, amount },
      });
      return result.transactionHash;
    };

    const decreaseAllowance = async (sender: string, spender: string, amount: string): Promise<string> => {
      const result = await client.execute(sender, contractAddress, {
        decrease_allowance: { spender, amount },
      });
      return result.transactionHash;
    };

    const transferFrom = async (
      sender: string,
      owner: string,
      recipient: string,
      amount: string,
    ): Promise<string> => {
      const result = await client.execute(sender, contractAddress, {
        transfer_from: { owner, recipient, amount },
      });
      return result.transactionHash;
    };

    const bond = async (sender: string, coin: Coin): Promise<string> => {
      const result = await client.execute(sender, contractAddress, { bond: {} }, undefined, [coin]);
      return result.transactionHash;
    };

    const unbond = async (sender: string, amount: string): Promise<string> => {
      const result = await client.execute(sender, contractAddress, { unbond: { amount } });
      return result.transactionHash;
    };

    const claim = async (sender: string): Promise<string> => {
      const result = await client.execute(sender, contractAddress, { claim: {} });
      return result.transactionHash;
    };

    return {
      contractAddress,
      balance,
      allowance,
      allAllowances,
      allAccounts,
      tokenInfo,
      investment,
      claims,
      minter,
      mint,
      transfer,
      burn,
      increaseAllowance,
      decreaseAllowance,
      transferFrom,
      bond,
      unbond,
      claim,
    };
  };
  return { use };
};

export interface Cw20Token {
  readonly address: string;
  readonly symbol: string;
  readonly decimals: number;
  readonly amount: string;
}

export function cw20TokenCompare(a: Cw20Token, b: Cw20Token): -1 | 0 | 1 {
  if (a.symbol < b.symbol) {
    return -1;
  }
  if (a.symbol > b.symbol) {
    return 1;
  }
  return 0;
}

export async function getCw20Token(contract: CW20Instance, address: string): Promise<Cw20Token | null> {
  try {
    const { symbol, decimals } = await contract.tokenInfo();
    const amount = await contract.balance(address);

    return { address: contract.contractAddress, symbol, decimals, amount };
  } catch (error) {
    // If no tokenInfo, or no balance, return null since it's not a CW20 token
    return null;
  }
}
