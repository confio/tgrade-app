import { ColumnProps } from "antd/lib/table";
import { ReactComponent as LinkIcon } from "App/assets/icons/link-icon.svg";
import { PoEContractType } from "codec/confio/poe/v1beta1/poe";
import { config } from "config/network";
import { useCallback, useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { nativeCoinToDisplay } from "utils/currency";
import { EngagementContractQuerier } from "utils/poeEngagement";
import { StakingContractQuerier } from "utils/staking";
import { ellipsifyAddress } from "utils/ui";
import { OperatorResponse, useLoadValidatorsBg, ValidatorContractQuerier } from "utils/validator";

import { ValidatorDetail } from "../ValidatorDetail";
import { StyledTable } from "./style";

interface BlockchainValues {
  totalEgPoints: number;
  totalEgRewards: number;
  totalTGD: number;
}

function validateURL(url: string) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i",
  ); // fragment locator
  return !!pattern.test(url);
}

export interface ValidatorType extends OperatorResponse {
  operator: string;
  engagementPoints?: number;
  rewards?: number;
  power?: number;
  staked: string;
  liquidStaked: string;
  vestedStaked: string;
  status?: string;
  metadata: {
    moniker: string;
    identity?: string;
    website?: string;
    security_contact?: string;
    details?: string;
  };
}

const columns: ColumnProps<ValidatorType>[] = [
  {
    title: "Validator",
    key: "moniker",
    width: "20%",
    render: (record: ValidatorType) => (
      <div key={record.metadata?.moniker} style={{ display: "flex", flexDirection: "column" }}>
        <b>{record.metadata?.moniker}</b>
        <p>{ellipsifyAddress(record.operator)}</p>
      </div>
    ),
    sorter: (a: ValidatorType, b: ValidatorType) => {
      if (
        (a.metadata?.moniker ? a.metadata?.moniker.toLowerCase() : "") <
        (b.metadata?.moniker ? b.metadata?.moniker.toLowerCase() : "")
      )
        return -1;
      if (
        (a.metadata?.moniker ? a.metadata?.moniker.toLowerCase() : "") >
        (b.metadata?.moniker ? b.metadata?.moniker.toLowerCase() : "")
      )
        return 1;

      return 0;
    },
  },

  {
    title: "Status",
    key: "status",
    width: "5%",
    render: (record: ValidatorType) => <p>{record.status}</p>,
    sorter: (a: ValidatorType, b: ValidatorType) => {
      function getSortNumFromStatus(status: string): number {
        switch (status) {
          case "active":
            return 1;
          case "inactive":
            return 2;
          default:
            return 3;
        }
      }
      return getSortNumFromStatus(b.status ?? "") - getSortNumFromStatus(a.status ?? "");
    },
  },
  {
    title: "Staked",
    key: "staked",
    width: "20%",
    render: (record: ValidatorType) => (
      <p>
        {record.staked || "—"} {config.coinMap[config.feeToken].denom}
      </p>
    ),
    sorter: (a: ValidatorType, b: ValidatorType) => {
      if ((a.staked ?? "") < (b.staked ?? "")) return -1;
      if ((a.staked ?? "") > (b.staked ?? "")) return 1;

      return 0;
    },
  },
  {
    title: "Distributed points",
    key: "engagementPoints",
    width: "20%",
    render: (record: ValidatorType) => <p>{record.engagementPoints}</p>,
    sorter: (a: ValidatorType, b: ValidatorType) => (a.engagementPoints ?? 0) - (b.engagementPoints ?? 0),
    defaultSortOrder: "descend",
  },
  {
    title: "Rewards",
    key: "rewards",
    width: "20%",
    render: (record: ValidatorType) => (
      <p>
        {record.rewards || "—"} {config.coinMap[config.feeToken].denom}
      </p>
    ),
    sorter: (a: ValidatorType, b: ValidatorType) => (a.rewards ?? 0) - (b.rewards ?? 0),
  },
  {
    title: "Voting Power",
    key: "power",
    width: "10%",
    render: (record: ValidatorType) => {
      const votingPowerOrZero = !record.power || record.power === 0 ? 0 : record.power;
      const fixedVotingPower = votingPowerOrZero.toFixed(3);
      const isSmallVotingPower = fixedVotingPower === "0.000" && votingPowerOrZero !== 0;
      const votingPower = isSmallVotingPower ? "~ 0.001" : fixedVotingPower;

      return <p>{votingPower} %</p>;
    },
    sorter: (a: ValidatorType, b: ValidatorType) => (a.power ?? 0) - (b.power ?? 0),
  },
  {
    title: "Website",
    key: "website",
    width: "5%",
    render: (record: ValidatorType) =>
      validateURL(record.metadata?.website || "") ? (
        <a href={record.metadata?.website}>
          <LinkIcon />
        </a>
      ) : (
        <p>{"—"}</p>
      ),
    sorter: (a: ValidatorType, b: ValidatorType) => {
      if ((a.metadata?.website ?? "") < (b.metadata?.website ?? "")) return -1;
      if ((a.metadata?.website ?? "") > (b.metadata?.website ?? "")) return 1;

      return 0;
    },
  },
];
export default function ValidatorOverview(): JSX.Element | null {
  const { handleError } = useError();
  const {
    sdkState: { client, config },
  } = useSdk();

  const { validators, status: validatorLoadingStatus } = useLoadValidatorsBg(config, client);
  const [validatorList, setValidatorList] = useState<readonly ValidatorType[]>([]);
  const [blockchainValues, setBlockchainValues] = useState<BlockchainValues>({
    totalEgPoints: 0,
    totalEgRewards: 0,
    totalTGD: 0,
  });
  const [selectedValidator, setSelectedValidator] = useState<ValidatorType>();

  const reloadValidator = useCallback(async (): Promise<void> => {
    if (!selectedValidator || !client) return;

    const valContract = new ValidatorContractQuerier(config, client);
    const operatorResponse = await valContract.getValidator(selectedValidator.operator);
    if (!operatorResponse) return;

    const egContract = new EngagementContractQuerier(config, PoEContractType.DISTRIBUTION, client);
    const ep = await egContract.getEngagementPoints(operatorResponse.operator);
    const withdrawableRewards = await egContract.getWithdrawableRewards(operatorResponse.operator);
    const displayWithdrawableRewards = nativeCoinToDisplay(withdrawableRewards, config.coinMap);
    const stakingContract = new StakingContractQuerier(config, client);
    const nativeStakedCoin = await stakingContract.getStakedTokensSum(operatorResponse.operator);
    const prettyStakedCoin = nativeCoinToDisplay(nativeStakedCoin, config.coinMap);
    const nativeStakedTokens = await stakingContract.getStakedTokens(operatorResponse.operator);
    const stakedTokens = {
      liquid: nativeCoinToDisplay(nativeStakedTokens.liquid, config.coinMap),
      vesting: nativeCoinToDisplay(nativeStakedTokens.vesting, config.coinMap),
    };
    const votingPower = await stakingContract.getVotingPower(operatorResponse.operator);

    const validator: ValidatorType = {
      ...operatorResponse,
      engagementPoints: ep,
      rewards: parseFloat(displayWithdrawableRewards.amount),
      staked: prettyStakedCoin.amount,
      liquidStaked: stakedTokens.liquid.amount,
      vestedStaked: stakedTokens.vesting.amount,
      status: "active",
      power: votingPower,
    };

    setSelectedValidator(validator);
    setValidatorList((validators) => [
      ...validators.filter((currentValidator) => currentValidator.operator !== validator.operator),
      validator,
    ]);
  }, [client, config, selectedValidator]);

  useEffect(() => {
    (async function updateValidators() {
      if (!client) return;

      try {
        const egContract = new EngagementContractQuerier(config, PoEContractType.DISTRIBUTION, client);

        const totalEgPoints = await egContract.getTotalEngagementPoints();
        const EgRewards = await egContract.getDistributedRewards();
        const totalEgRewards = parseFloat(EgRewards.amount);
        //TODO: Get from network or remove.
        const totalTGD = 100000000;
        setBlockchainValues({ totalEgPoints, totalEgRewards, totalTGD });

        const validatorList = await Promise.all(
          validators.map(async (operatorResponse) => {
            const ep = await egContract.getEngagementPoints(operatorResponse.operator);
            const withdrawableRewards = await egContract.getWithdrawableRewards(operatorResponse.operator);
            const displayWithdrawableRewards = nativeCoinToDisplay(withdrawableRewards, config.coinMap);
            const stakingContract = new StakingContractQuerier(config, client);
            const nativeStakedCoin = await stakingContract.getStakedTokensSum(operatorResponse.operator);
            const prettyStakedCoin = nativeCoinToDisplay(nativeStakedCoin, config.coinMap);
            const nativeStakedTokens = await stakingContract.getStakedTokens(operatorResponse.operator);
            const stakedTokens = {
              liquid: nativeCoinToDisplay(nativeStakedTokens.liquid, config.coinMap),
              vesting: nativeCoinToDisplay(nativeStakedTokens.vesting, config.coinMap),
            };
            const votingPower = await stakingContract.getVotingPower(operatorResponse.operator);

            const validatorItem: ValidatorType = {
              ...operatorResponse,
              engagementPoints: ep,
              rewards: parseFloat(displayWithdrawableRewards.amount),
              staked: prettyStakedCoin.amount,
              liquidStaked: stakedTokens.liquid.amount,
              vestedStaked: stakedTokens.vesting.amount,
              status: "active",
              power: votingPower,
            };

            return validatorItem;
          }),
        );

        setValidatorList(validatorList);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [client, config, handleError, validators]);

  return (
    <div style={{ width: "100%" }}>
      <ValidatorDetail
        validator={selectedValidator}
        blockchainValues={blockchainValues}
        visible={!!selectedValidator}
        onCancel={() => {
          setSelectedValidator(undefined);
        }}
        reloadValidator={reloadValidator}
      />
      <StyledTable
        loading={validatorLoadingStatus === "loadingFirstPage"}
        pagination={{ position: ["bottomCenter"], hideOnSinglePage: true }}
        dataSource={validatorList}
        columns={columns as any}
        rowKey={(record: any) => record.operator}
        onRow={(record: any) => ({
          onClick: () => {
            setSelectedValidator(record);
          },
        })}
      />
    </div>
  );
}
