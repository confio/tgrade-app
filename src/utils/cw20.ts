import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Decimal } from "@cosmjs/math";
import { calculateFee, GasPrice } from "@cosmjs/stargate";
import tgradeLogo from "App/assets/icons/tgradeLogo.svg";
import tempImgUrl from "App/assets/icons/token-placeholder.png";
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

export interface InstantiateMarketingInfo {
  readonly project?: string | null;
  readonly description?: string | null;
  readonly marketing?: string | null;
  readonly logo?: LogoType;
}

export type LogoType = {
  readonly url?: string;
} & {
  readonly embedded?: EmbeddedLogoType;
};

export type EmbeddedLogoType = {
  readonly svg?: string;
} & {
  readonly png?: string;
};

export type LogoInfo = {
  readonly url?: string;
} & "embedded";
export interface MarketingInfoResponse {
  readonly project?: string | null;
  readonly description?: string | null;
  readonly marketing?: string | null;
  readonly logo?: LogoInfo;
}

export interface DownloadLogoResponse {
  readonly mime_type: string;
  readonly data: string;
}

export class Contract20WS {
  static readonly GAS_CREATE_TOKEN = 500_000;
  static readonly GAS_AUTHORIZE = 500_000;

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
    gasPrice: GasPrice,
    marketingInfo?: InstantiateMarketingInfo,
    dsoAddress?: string,
  ): Promise<string> {
    //Initial Message
    const initMsg: any = {
      name: name,
      symbol: symbol,
      decimals: decimals,
      initial_balances: initial_balances,
      minter: minter,
      marketing: marketingInfo,
      whitelist_group: dsoAddress,
    };

    const { contractAddress } = await signingClient.instantiate(
      creatorAddress,
      codeId,
      initMsg,
      "CW20 instance",
      calculateFee(Contract20WS.GAS_CREATE_TOKEN, gasPrice),
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
  static async getMarketingInfo(
    client: CosmWasmClient,
    contractAddress: string,
  ): Promise<MarketingInfoResponse> {
    const marketingInfo: MarketingInfoResponse = await client.queryContractSmart(contractAddress, {
      marketing_info: {},
    });
    return marketingInfo;
  }
  static async getLogoSrc(client: CosmWasmClient, contractAddress: string): Promise<string> {
    const { logo }: MarketingInfoResponse = await this.getMarketingInfo(client, contractAddress);
    if (logo?.url) return logo.url;

    if (logo === "embedded") {
      const { mime_type, data }: DownloadLogoResponse = await client.queryContractSmart(contractAddress, {
        download_logo: {},
      });

      const base64Src = `data:${mime_type};base64, ${data}`;
      return base64Src;
    }

    return tempImgUrl;
  }
  static async getTokenInfo(
    client: CosmWasmClient,
    address: string,
    contractAddress: string,
    config: NetworkConfig,
  ): Promise<TokenProps> {
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
        img: tgradeLogo,
      };
    } else {
      const token_info = await client.queryContractSmart(contractAddress, {
        token_info: {},
      });
      const balance: any = await this.getBalance(client, contractAddress, address);
      const humanBalance = Decimal.fromAtomics(balance.balance, token_info?.decimals).toString();
      const imgSrc = await this.getLogoSrc(client, contractAddress);
      const result = {
        ...token_info,
        ...balance,
        humanBalance: humanBalance,
        address: contractAddress,
        img: imgSrc,
      };
      return result;
    }
  }

  static async getAll(
    config: NetworkConfig,
    client: CosmWasmClient,
    clientAddress: string,
  ): Promise<{ [key: string]: TokenProps }> {
    const tokensMap: { [key: string]: TokenProps } = {};

    // Add feeToken to lists
    const feeTokenInfo = await this.getTokenInfo(client, clientAddress, config.feeToken, config);
    tokensMap[config.feeToken] = feeTokenInfo;

    // Get cw20 and tgrade token addresses
    const cw20TokensAddressesPromise = config.codeIds?.cw20Tokens?.length
      ? client.getContracts(config.codeIds.cw20Tokens[0])
      : Promise.resolve([]);
    const tgradeCw20AddressesPromise = config.codeIds?.tgradeCw20?.length
      ? client.getContracts(config.codeIds.tgradeCw20[0])
      : Promise.resolve([]);
    const tokenAddresses = (
      await Promise.all([cw20TokensAddressesPromise, tgradeCw20AddressesPromise])
    ).flat();

    // Fill map with tokens info
    const tokensInfos = await Promise.all(
      tokenAddresses.map((address) => this.getTokenInfo(client, clientAddress, address, config)),
    );
    tokensInfos.forEach((tokenInfo) => {
      tokensMap[tokenInfo.address] = tokenInfo;
    });

    return tokensMap;
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
  static async getDsoAddress(client: CosmWasmClient, contractAddress?: string): Promise<string | undefined> {
    if (!contractAddress) return undefined;

    try {
      const { address } = await client.queryContractSmart(contractAddress, { whitelist: {} });
      return address;
    } catch {
      return undefined;
    }
  }
  static async Authorized(
    signingClient: SigningCosmWasmClient,
    contractAddress: string,
    address: string,
    pairAddress: string,
    gasPrice: GasPrice,
  ): Promise<any> {
    const result = await signingClient.execute(
      address,
      contractAddress,
      {
        increase_allowance: {
          spender: pairAddress,
          amount: UINT128_MAX,
        },
      },
      calculateFee(Contract20WS.GAS_AUTHORIZE, gasPrice),
    );

    return result;
  }
}
