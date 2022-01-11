import { ColumnProps } from "antd/lib/table";
import { ReactComponent as LinkIcon } from "App/assets/icons/link-icon.svg";
import { PoEContractType } from "codec/confio/poe/v1beta1/poe";
import { config } from "config/network";
import { useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { EngagementContractQuerier } from "utils/poeEngagement";
import { ellipsifyAddress } from "utils/ui";
import { OperatorResponse, ValidatorContractQuerier } from "utils/validator";

import { ValidatorDetail } from "../ValidatorDetail";
import { StyledTable } from "./style";

interface BlockchainValues {
  totalEgPoints: number;
  totalEgRewards: number;
  totalTGD: number;
}

export interface ValidatorType extends OperatorResponse {
  operator: string;
  engagementPoints?: number;
  rewards?: number;
  power?: number;
  staked?: string;
  status?: string;
  slashEvents: any;
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
    render: (record: ValidatorType) => <p>{record.staked || "—"}</p>,
    sorter: (a: ValidatorType, b: ValidatorType) => {
      if ((a.staked ?? "") < (b.staked ?? "")) return -1;
      if ((a.staked ?? "") > (b.staked ?? "")) return 1;

      return 0;
    },
  },
  {
    title: "Engagement points",
    key: "engagementPoints",
    render: (record: ValidatorType) => <p>{record.engagementPoints}</p>,
    sorter: (a: ValidatorType, b: ValidatorType) => (a.engagementPoints ?? 0) - (b.engagementPoints ?? 0),
    defaultSortOrder: "descend",
  },
  {
    title: "Rewards",
    key: "rewards",
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
    render: (record: ValidatorType) => <p>{record.power || "—"}</p>,
    sorter: (a: ValidatorType, b: ValidatorType) => (a.power ?? 0) - (b.power ?? 0),
  },
  {
    title: "Website",
    key: "website",
    render: (record: ValidatorType) =>
      record.metadata?.website ? (
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
  const [validatorList, setValidatorList] = useState<readonly ValidatorType[]>([]);
  const [blockchainValues, setBlockchainValues] = useState<BlockchainValues>({
    totalEgPoints: 0,
    totalEgRewards: 0,
    totalTGD: 0,
  });
  const [selectedValidator, setSelectedValidator] = useState<ValidatorType>();
  const { handleError } = useError();
  const {
    sdkState: { client, config },
  } = useSdk();

  useEffect(() => {
    (async function updateValidators() {
      if (!client) return;

      try {
        const valContract = new ValidatorContractQuerier(config, client);
        const validators = await valContract.getAllValidators();
        const valActive = await valContract.getActiveValidators();
        const egContract = new EngagementContractQuerier(config, PoEContractType.DISTRIBUTION, client);

        const totalEgPoints = await egContract.getTotalEngagementPoints();
        const EgRewards = await egContract.getDistributedFunds();
        const totalEgRewards = parseFloat(EgRewards.amount);
        const totalTGD = 100000000;
        setBlockchainValues({ totalEgPoints, totalEgRewards, totalTGD });

        const validatorList = await Promise.all(
          validators.map(async (operatorResponse) => {
            const ep = await egContract.getEngagementPoints(operatorResponse.operator);
            const rewards = await egContract.getWithdrawableFunds(operatorResponse.operator);
            const slashEvents = await valContract.getSlashingEvents(operatorResponse.operator);

            const validatorItem: ValidatorType = {
              ...operatorResponse,
              engagementPoints: ep,
              rewards: Number(rewards.amount),
              status: "active",
              power: Number(valActive[0].power),
              slashEvents: slashEvents,
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
  }, [client, config, handleError]);

  return (
    <div style={{ width: "100%" }}>
      <ValidatorDetail
        validator={selectedValidator}
        blockchainValues={blockchainValues}
        visible={!!selectedValidator}
        onCancel={() => {
          setSelectedValidator(undefined);
        }}
      />
      <StyledTable
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
