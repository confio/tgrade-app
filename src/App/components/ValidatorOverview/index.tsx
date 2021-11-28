import { Table } from "antd";
import { Typography } from "antd";
import { useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { ellipsifyAddress } from "utils/ui";
import { ValidatorContractQuerier } from "utils/validator";

interface IValidator {
  moniker: string;
  identity?: string;
  website?: string;
  security_contact?: string;
  details?: string;
}

const columns = [
  {
    title: "Validator",
    key: "moniker",
    render: (record: IValidator) => (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <b>{record.moniker}</b>
      </div>
    ),
  },

  {
    title: "Status",
    dataIndex: "status",
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
    dataIndex: "staked",
    sorter: (a: any, b: any) => a.staked - b.staked,
  },
  {
    title: "Engagement points",
    dataIndex: "engagementPoints",
    sorter: (a: any, b: any) => a.engagementPoints - b.engagementPoints,
  },
  {
    title: "Rewards",
    dataIndex: "rewards",
    sorter: (a: any, b: any) => a.rewards - b.rewards,
  },
  {
    title: "Voting Power",
    dataIndex: "votingPower",
    sorter: (a: any, b: any) => a.votingPower - b.votingPower,
  },
  {
    title: "Website",
    dataIndex: "website",
  },
];
export default function ValidatorOverview(): JSX.Element | null {
  const [validatorList, setValidatorList] = useState<any | null>(null);
  const { handleError } = useError();
  const {
    sdkState: { client, config },
  } = useSdk();

  useEffect(() => {
    (async function updateValidators() {
      if (!client) return;

      try {
        const valContract = new ValidatorContractQuerier(config, client);
        const valList = await valContract.getValidators();
        console.log(valList);
        setValidatorList(valList);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [client, validatorList, config, handleError]);
  return <Table style={{ margin: "25px" }} dataSource={validatorList} columns={columns} pagination={false} />;
}
