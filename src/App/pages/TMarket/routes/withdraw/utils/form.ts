import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { paths } from "App/paths";
import { NetworkConfig } from "config/network";
import { gtagTMarketAction } from "utils/analytics";
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
  history: any,
  setModalOpen: (b: boolean) => void,
): Promise<void> => {
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
    values.To = "1.0";
    setDetail({ ...detailsWithdraw, txHash: result.transactionHash });
    setLoading(false);
    history.push(`${paths.tmarket.prefix}${paths.tmarket.withdraw.prefix}${paths.tmarket.withdraw.result}`);
  } catch (error) {
    setLoading(false);
    console.error(error);
  }
};
