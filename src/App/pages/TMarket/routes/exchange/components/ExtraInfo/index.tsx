import { Col } from "antd";
import InfoRow from "App/components/InfoRow";
import { useFormikContext } from "formik";
import { useSdk } from "service";
import { useExchange } from "service/exchange";
import { SwapFormValues } from "utils/tokens";
import Divider from "./style";

const ExtraInfo = (): JSX.Element | null => {
  const { exchangeState } = useExchange();
  const { sdkState } = useSdk();
  const { values } = useFormikContext<SwapFormValues>();
  const { simulatedSwap } = exchangeState;

  if (!simulatedSwap || !values.selectTo || !values.selectFrom) return null;
  const DEFAULT_SLIPPAGE = 0.5 / 100;
  const PriceImpact = PrettyNumber(Number(simulatedSwap.spread_amount) / Number(simulatedSwap.return_amount));
  const MinimumReceived = PrettyNumber(Number(simulatedSwap.return_amount) * (1 - DEFAULT_SLIPPAGE));
  const LiquidityProviderFee = PrettyNumber(
    (Number(values.From) / Number(values.To)) * Number(simulatedSwap.commission_amount),
  );
  const fee = PrettyNumber(Number(sdkState.config.gasPrice.amount) / 2);

  //Tootips:
  const tooltips = {
    minimumReceived:
      "Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.",
    priceImpact: "The difference between the market price and estimated price due to trade size.",
    liquidityProviderFee: (): JSX.Element => (
      <span>For each trade there is a 0.3% fee which is paid to the liquidity providers</span>
    ),
    txFee:
      "The Tx fee is a fee charged by the blockchain data centers for processing your data transactions.",
  };

  return (
    <>
      <Col offset={5} span={15}>
        <InfoRow
          label="Minimum Received"
          value={`${MinimumReceived} ${values.selectTo?.symbol}`}
          tooltip={tooltips.minimumReceived}
        />
        <InfoRow label="Price Impact" value={`${PriceImpact} %`} tooltip={tooltips.priceImpact} />
        <InfoRow
          label="Liquidity Provider Fee"
          value={`${LiquidityProviderFee} ${values.selectFrom?.symbol}`}
          tooltip={tooltips.liquidityProviderFee}
        />
        <InfoRow label="Tx Fee" value={`${fee} TGD`} tooltip={tooltips.txFee} />
      </Col>
      <Divider />
    </>
  );
};

export default ExtraInfo;

//Makes a large number with to many decimals shorter
//Ex 0.0238454945350234 => 0.0238
const PrettyNumber = (largeNumber: string | number): number => {
  const decimals = 4;
  const number = Number(largeNumber);

  if (number <= 0) return 0;
  const response = number.toFixed(decimals);

  return Number(response);
};
