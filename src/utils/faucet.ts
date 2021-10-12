import { FaucetClient } from "@cosmjs/faucet-client";
import { NetworkConfig } from "config/network";

type TokenQueryStatus = {
  [key: string]: "idle" | "querying" | "success" | "error";
};

export class Faucet {
  readonly client: FaucetClient;
  readonly tokenQueryStatus: TokenQueryStatus;

  constructor(config: NetworkConfig) {
    this.client = new FaucetClient(config.faucetUrl);

    const tokens = config.faucetTokens ?? [config.feeToken];
    const tokenQueryStatus: TokenQueryStatus = {};
    for (const token of tokens) {
      tokenQueryStatus[token] = "idle";
    }

    this.tokenQueryStatus = tokenQueryStatus;
  }

  async creditAll(address: string): Promise<void> {
    const statusesPerToken = Object.entries(this.tokenQueryStatus);

    for (const [token, status] of statusesPerToken) {
      if (status !== "idle") continue;

      this.tokenQueryStatus[token] = "querying";
      try {
        await this.client.credit(address, token);
        this.tokenQueryStatus[token] = "success";
      } catch {
        this.tokenQueryStatus[token] = "error";
      }
    }
  }
}
