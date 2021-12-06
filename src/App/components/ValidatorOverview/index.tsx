import { ReactComponent as LinkIcon } from "App/assets/icons/link-icon.svg";
import { config } from "config/network";
import { useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { EngagementContractQuerier } from "utils/poeEngagement";
import { ellipsifyAddress } from "utils/ui";
import { ValidatorContractQuerier } from "utils/validator";

import { ValidatorDetail } from "../ValidatorDetail";
import { StyledTable } from "./style";

interface BlockchainValues {
  totalEgPoints: number;
  totalEgRewards: number;
  totalTGD: number;
}

type ValidatorType = {
  operator: string;
  engagementPoints?: number;
  rewards?: number;
  power?: number;
  staked?: string;
  status?: string;
  slashEvents: [];
  metadata: {
    moniker: string;
    identity?: string;
    website?: string;
    security_contact?: string;
    details?: string;
  };
};

const initialValidator = {
  operator: "",
  engagementPoints: 0,
  rewards: 0,
  power: 0,
  staked: "",
  status: "",
  slashEvents: [""],
  metadata: {
    moniker: "",
    identity: "",
    website: "",
    security_contact: "",
    details: "",
  },
};

const columns = [
  {
    title: "Validator",
    key: "moniker",
    render: (record: ValidatorType) => (
      <div key={record.metadata.moniker} style={{ display: "flex", flexDirection: "column" }}>
        <b>{record.metadata.moniker}</b>
        <p>{ellipsifyAddress(record.operator)}</p>
      </div>
    ),
    sorter: (a: any, b: any) => a.staked - b.staked,
  },

  {
    title: "Status",
    key: "status",
    render: (record: ValidatorType) => <p>{record.status}</p>,
    sorter: (a: any, b: any) => {
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
      return getSortNumFromStatus(b.status) - getSortNumFromStatus(a.status);
    },
  },
  {
    title: "Staked",
    key: "staked",
    render: (record: ValidatorType) => <p>{record.staked || "—"}</p>,
    sorter: (a: any, b: any) => a.staked - b.staked,
  },
  {
    title: "Engagement points",
    key: "engagementPoints",
    render: (record: ValidatorType) => <p>{record.engagementPoints}</p>,
    sorter: (a: any, b: any) => a.engagementPoints - b.engagementPoints,
  },
  {
    title: "Rewards",
    key: "rewards",
    render: (record: ValidatorType) => (
      <p>
        {record.rewards || "—"} {config.coinMap[config.feeToken].denom}
      </p>
    ),
    sorter: (a: any, b: any) => a.rewards - b.rewards,
  },
  {
    title: "Voting Power",
    key: "power",
    render: (record: ValidatorType) => <p>{record.power || "—"}</p>,
    sorter: (a: any, b: any) => a.power - b.power,
  },
  {
    title: "Website",
    key: "website",
    render: (record: ValidatorType) =>
      record.metadata.website ? (
        <a href={record.metadata.website}>
          <LinkIcon />
        </a>
      ) : (
        <p>-</p>
      ),
    sorter: (a: any, b: any) => a.staked - b.staked,
  },
];
export default function ValidatorOverview(): JSX.Element | null {
  const [validatorList, setValidatorList] = useState<any | null>(null);
  const [blockchainValues, setBlockchainValues] = useState<BlockchainValues>({
    totalEgPoints: 0,
    totalEgRewards: 0,
    totalTGD: 0,
  });
  const [selectedValidator, setSelectedValidator] = useState<any | null>(initialValidator);
  const [toggleModal, setToggleModal] = useState(false);
  const { handleError } = useError();
  const {
    sdkState: { client, config },
  } = useSdk();

  function handleToggle() {
    setToggleModal((toggleModal) => !toggleModal);
  }

  useEffect(() => {
    (async function updateValidators() {
      if (!client) return;

      try {
        const valContract = new ValidatorContractQuerier(config, client);
        const valList = await valContract.getValidators();
        const valActive = await valContract.getActiveValidators();
        const egContract = new EngagementContractQuerier(config, client);

        const totalEgPoints = await egContract.getTotalEngagementPoints();
        const EgRewards = await egContract.getDistributedFunds();
        const totalEgRewards = parseFloat(EgRewards.amount);
        const totalTGD = 100000000;
        setBlockchainValues({ totalEgPoints, totalEgRewards, totalTGD });

        /*TODO : Change to for loop*/
        valList.forEach(async (validator: any) => {
          const ep = await egContract.getEngagementPoints(validator.operator);
          const rewards = await egContract.getWithdrawableFunds(validator.operator);
          const slashEvents = await valContract.getSlashingEvents(validator.operator);

          validator["engagementPoints"] = ep;
          validator["rewards"] = rewards.amount;
          validator["status"] = "active"; //Figure out how to get actual value
          validator["power"] = valActive[0].power;
          validator["slashEvents"] = slashEvents;
        });

        setValidatorList(valList);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [client, config, handleError]);

  return (
    <div>
      <ValidatorDetail
        validator={selectedValidator}
        blockchainValues={blockchainValues}
        visible={toggleModal}
        onCancel={handleToggle}
      />
      <StyledTable
        dataSource={validatorList}
        columns={columns}
        pagination={false}
        onRow={(record) => ({
          onClick: () => {
            setSelectedValidator(record);
            handleToggle();
          },
        })}
      />
    </div>
  );
}
