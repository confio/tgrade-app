import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { paths } from "App/paths";
import { NetworkConfig } from "config/network";
import { gtagTMarketAction } from "utils/analytics";
import { Contract20WS } from "utils/cw20";
import { DetailWithdraw, LPToken, Pool, WithdrawFormValues } from "utils/tokens";

export const handleSubmit = async (
  values: WithdrawFormValues,
  client: CosmWasmClient | undefined,
  signingClient: SigningCosmWasmClient | undefined,
  address: string | undefined,
  config: NetworkConfig,
  lpSelected: LPToken | undefined,
  detailsWithdraw: DetailWithdraw | undefined,
  setLoading: (l: boolean) => void,
  setDetail: (d: DetailWithdraw) => void,
  updateLPtoken: (t: { [a: string]: LPToken }) => void,
  history: any,
  setModalOpen: (b: boolean) => void,
): Promise<void> => {
  console.log("SUBMIT WITH");
  gtagTMarketAction("withdraw_try");
  if (!address) {
    setModalOpen(true);
  }
  if (
    !values.From ||
    !values.selectFrom ||
    !signingClient ||
    !address ||
    !client ||
    !lpSelected ||
    !detailsWithdraw
  )
    return;
  try {
    setLoading(true);
    const result = await Pool.WithdrawLiquidity(
      signingClient,
      address,
      lpSelected.pair,
      values,
      config.gasPrice,
    );
    gtagTMarketAction("withdraw_success");
    const token_info = await Contract20WS.getTokenInfo(client, address, values.selectFrom.address, config);
    values.To = "1.0";
    updateLPtoken({ [lpSelected.token.address]: { token: token_info, pair: lpSelected.pair } });
    setDetail({ ...detailsWithdraw, txHash: result.transactionHash });
    setLoading(false);
    history.push(`${paths.tmarket.prefix}${paths.tmarket.withdraw.prefix}${paths.tmarket.withdraw.result}`);
  } catch (error) {
    setLoading(false);
    console.error(error);
  }
};
