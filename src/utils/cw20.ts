import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Decimal } from "@cosmjs/math";
import { NetworkConfig } from "config/network";
import { UINT128_MAX } from "./currency";
import { PairProps, TokenProps } from "./tokens";

export interface InitialValuesInterface {
  address: string;
  amount: string;
}

export interface MinterInterface {
  minter: string;
  cap?: string;
}

export class Contract20WS {
  readonly #signingClient: SigningCosmWasmClient;

  constructor(address: string, signingClient: SigningCosmWasmClient) {
    this.#signingClient = signingClient;
  }

  static async createContract(
    signingClient: SigningCosmWasmClient,
    codeId: number,
    creatorAddress: string,
    name: string,
    symbol: string,
    decimals: number,
    initial_balances: Array<InitialValuesInterface>,
    minter: MinterInterface | undefined,
  ): Promise<string> {
    //Initial Message
    const initMsg: any = {
      name: name,
      symbol: symbol,
      decimals: decimals,
      initial_balances: initial_balances,
      minter: minter,
    };

    const { contractAddress } = await signingClient.instantiate(
      creatorAddress,
      codeId,
      initMsg,
      "CW20 instance",
    );
    return contractAddress;
  }
  static async getBalance(
    client: CosmWasmClient,
    contractAddress: string,
    clientAddress: string,
  ): Promise<string> {
    const balance = await client.queryContractSmart(contractAddress, {
      balance: {
        address: clientAddress,
      },
    });

    return balance;
  }
  static async getTokenInfo(
    client: CosmWasmClient,
    address: string,
    contractAddress: string,
    config: NetworkConfig,
  ): Promise<TokenProps> {
    const temp_img_url = "https://i.ibb.co/Lkq69SV/download-1-1.png";

    if (contractAddress === "utgd") {
      const { amount: balance_utgd } = await client.getBalance(address, "utgd");
      return {
        address: "utgd",
        balance: balance_utgd,
        humanBalance: Decimal.fromAtomics(balance_utgd, config.coinMap.utgd.fractionalDigits).toString(),
        decimals: config.coinMap.utgd.fractionalDigits,
        name: "Tgrade",
        symbol: config.coinMap.utgd.denom,
        total_supply: "",
        img: temp_img_url,
      };
    } else {
      const token_info = await client.queryContractSmart(contractAddress, {
        token_info: {},
      });
      const balance: any = await this.getBalance(client, contractAddress, address);
      const humanBalance = Decimal.fromAtomics(balance.balance, token_info?.decimals).toString();
      const result = {
        ...token_info,
        ...balance,
        humanBalance: humanBalance,
        address: contractAddress,
        img: temp_img_url,
      };
      return result;
    }
  }

  static async getAll(
    config: NetworkConfig,
    client: CosmWasmClient,
    clientAddress: string,
  ): Promise<{ [key: string]: TokenProps }> {
    if (config.codeIds?.cw20Tokens) {
      const addresses = await client?.getContracts(config.codeIds.cw20Tokens[0]);
      const tokensMap: { [key: string]: TokenProps } = {};
      //Add utgd to lists
      const utgd = await this.getTokenInfo(client, clientAddress, "utgd", config);
      tokensMap["utgd"] = utgd;
      addresses.map(
        async (address): Promise<void> => {
          const token_info: TokenProps = await this.getTokenInfo(client, clientAddress, address, config);
          tokensMap[address] = token_info;
        },
      );
      return tokensMap;
    } else {
      return {};
    }
  }
  static async getLPTokens(
    client: CosmWasmClient,
    clientAddress: string,
    pairs: { [key: string]: PairProps },
    tokens: { [key: string]: TokenProps },
    config: NetworkConfig,
  ): Promise<{ [id: string]: { token: TokenProps; pair: PairProps } }> {
    const tokensMap: { [key: string]: { token: TokenProps; pair: PairProps } } = {};

    Object.keys(pairs).map(
      async (address): Promise<void> => {
        const pair = pairs[address];
        const identifierA = pair.asset_infos[0].native || pair.asset_infos[0].token;
        const identifierB = pair.asset_infos[1].native || pair.asset_infos[1].token;
        const token_info: TokenProps = await this.getTokenInfo(
          client,
          clientAddress,
          pair.liquidity_token,
          config,
        );
        if (identifierA && identifierB) {
          const tokenA = tokens[identifierA];
          const tokenB = tokens[identifierB];
          if (!tokenA || !tokenB) return;
          const name = `${tokenA.symbol}-${tokenB.symbol}`;
          tokensMap[`${pair.liquidity_token}`] = { token: { ...token_info, name: name }, pair: pair };
          return;
        } else {
          tokensMap[`${pair.liquidity_token}`] = { token: token_info, pair: pair };
        }
      },
    );
    return tokensMap;
  }
  static async getAllowance(
    client: CosmWasmClient,
    contractAddress: string,
    address: string,
    pairAddress: string,
  ): Promise<string> {
    const result_allowance = await client.queryContractSmart(contractAddress, {
      allowance: {
        owner: address,
        spender: pairAddress,
      },
    });
    return result_allowance.allowance;
  }
  static async Authorized(
    signingClient: SigningCosmWasmClient,
    contractAddress: string,
    address: string,
    pairAddress: string,
  ): Promise<any> {
    const result = await signingClient.execute(address, contractAddress, {
      increase_allowance: {
        spender: pairAddress,
        amount: UINT128_MAX,
      },
    });

    return result;
  }
}
