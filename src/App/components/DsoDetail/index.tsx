import { Typography } from "antd";
import Stack from "../Stack/style";
import Table from "App/components/Table";
import ButtonAddNew from "App/components/ButtonAddNew";
import * as React from "react";
import { useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { DsoContractQuerier } from "utils/dso";
import pendingIcon from "App/assets/icons/clock.svg";
import rejectedIcon from "App/assets/icons/cross.svg";
import passedIcon from "App/assets/icons/tick.svg";
import CreateProposalModal from "../CreateProposalModal";
import DsoIdActions from "App/components/DsoIdActions";
import Escrow from "App/components/Escrow";
import Members from "App/components/Members";
import ProposalDetailModal from "App/components/ProposalDetailModal";
import { EscrowMembersContainer, ProposalsContainer, StatusBlock, StatusParagraph } from "./style";
const { Title, Paragraph } = Typography;

function getImgSrcFromStatus(status: string) {
  switch (status) {
    case "executed":
    case "passed":
      return { src: passedIcon };
    case "rejected":
      return { src: rejectedIcon };
    default:
      return { src: pendingIcon };
  }
}

const columns = [
  {
    title: "Nº",
    dataIndex: "id",
    key: "id",
    sorter: (a: any, b: any) => a.id - b.id,
  },
  {
    title: "Type",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Due date",
    key: "expires",
    render: (record: any) => {
      const formatedDate = new Date(record.expires.at_time / 1000000).toLocaleDateString();
      const formatedTime = new Date(record.expires.at_time / 1000000).toLocaleTimeString();
      return (
        <>
          <div>{formatedDate}</div>
          <div>{formatedTime}</div>
        </>
      );
    },
    sorter: (a: any, b: any) => {
      const aDate = new Date(a.expires.at_time / 1000000);
      const bDate = new Date(b.expires.at_time / 1000000);
      return bDate.getTime() - aDate.getTime();
    },
  },
  {
    title: "Status",
    key: "status",
    render: (record: any) => (
      <StatusBlock>
        <StatusParagraph status={record.status}>
          <img alt="" {...getImgSrcFromStatus(record.status)} />
          {(record.status as string).charAt(0).toUpperCase() + (record.status as string).slice(1)}
        </StatusParagraph>
        <Paragraph>Yes: {record.votes.yes}</Paragraph>
        <Paragraph>No: {record.votes.no}</Paragraph>
        <Paragraph>Abstained: {record.votes.abstain}</Paragraph>
      </StatusBlock>
    ),
    sorter: (a: any, b: any) => {
      function getSortNumFromStatus(status: string): number {
        switch (status) {
          case "executed":
            return 1;
          case "passed":
            return 2;
          case "rejected":
            return 3;
          default:
            return 4;
        }
      }

      return getSortNumFromStatus(b.status) - getSortNumFromStatus(a.status);
    },
  },
  {
    title: "Description",
    key: "description",
    render: (record: any) => <Paragraph ellipsis={{ rows: 4 }}>{record.description}</Paragraph>,
  },
];

interface DsoDetailParams {
  readonly dsoAddress: string;
}

export default function DsoDetail({ dsoAddress }: DsoDetailParams): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { client, address },
  } = useSdk();

  const [isCreateProposalModalOpen, setCreateProposalModalOpen] = useState(false);

  const [proposals, setProposals] = useState<any>([]);
  const [clickedProposal, setClickedProposal] = useState<number>();

  const refreshProposals = React.useCallback(async () => {
    if (!client) return;

    try {
      const dsoContract = new DsoContractQuerier(dsoAddress, client);
      const proposals = await dsoContract.getProposals();
      setProposals(proposals);
    } catch (error) {
      handleError(error);
    }
  }, [client, dsoAddress, handleError]);

  useEffect(() => {
    refreshProposals();
  }, [refreshProposals]);

  return (
    <>
      <Stack>
        <DsoIdActions />
        <EscrowMembersContainer>
          <Escrow />
          <Members />
        </EscrowMembersContainer>
        <ProposalsContainer>
          <header>
            <Title level={2}>Proposals</Title>
            {address ? (
              <ButtonAddNew text="Add proposal" onClick={() => setCreateProposalModalOpen(true)} />
            ) : null}
          </header>
          {proposals.length ? (
            <Table
              columns={columns}
              pagination={false}
              dataSource={proposals}
              onRow={(record: any) => ({
                onClick: () => setClickedProposal(record.id),
              })}
            />
          ) : null}
        </ProposalsContainer>
      </Stack>
      <CreateProposalModal
        isModalOpen={isCreateProposalModalOpen}
        closeModal={() => setCreateProposalModalOpen(false)}
        refreshProposals={refreshProposals}
      />
      <ProposalDetailModal
        isModalOpen={!!clickedProposal}
        closeModal={() => setClickedProposal(undefined)}
        proposalId={clickedProposal ?? 0}
        refreshProposals={refreshProposals}
      />
    </>
  );
}
