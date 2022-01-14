import { Typography } from "antd";
import pendingIcon from "App/assets/icons/clock.svg";
import rejectedIcon from "App/assets/icons/cross.svg";
import passedIcon from "App/assets/icons/tick.svg";
import ButtonAddNew from "App/components/ButtonAddNew";
import { lazy, useCallback, useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { ProposalResponse, ValidatorVotingContractQuerier } from "utils/validatorVoting";

import Stack from "../Stack/style";
import { ProposalsContainer, StatusBlock, StatusParagraph } from "./style";

const ValidatorCreateProposalModal = lazy(() => import("App/components/ValidatorCreateProposalModal"));
const ValidatorProposalDetailModal = lazy(() => import("App/components/ValidatorProposalDetailModal"));
const Table = lazy(() => import("App/components/Table"));

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
    sorter: (a: ProposalResponse, b: ProposalResponse) => a.id - b.id,
  },
  {
    title: "Type",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Due date",
    key: "expires",
    render: (record: ProposalResponse) => {
      const dateObj = new Date(parseInt(record.expires, 10) / 1000000);
      return (
        <>
          <div>{dateObj.toLocaleDateString()}</div>
          <div>{dateObj.toLocaleTimeString()}</div>
        </>
      );
    },
    sorter: (a: ProposalResponse, b: ProposalResponse) => {
      const aDate = new Date(parseInt(a.expires, 10) / 1000000);
      const bDate = new Date(parseInt(b.expires, 10) / 1000000);
      return bDate.getTime() - aDate.getTime();
    },
  },
  {
    title: "Status",
    key: "status",
    render: (record: ProposalResponse) => (
      <StatusBlock>
        <StatusParagraph status={record.status}>
          <img alt="" {...getImgSrcFromStatus(record.status)} />
          {(record.status as string).charAt(0).toUpperCase() + (record.status as string).slice(1)}
        </StatusParagraph>
        <Paragraph>Yes: {record.votes.yes ?? 0}</Paragraph>
        <Paragraph>No: {record.votes.no ?? 0}</Paragraph>
        <Paragraph>Abstained: {record.votes.abstain ?? 0}</Paragraph>
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

export default function ValidatorProposals(): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, client, address },
  } = useSdk();

  const [isTableLoading, setTableLoading] = useState(true);
  const [isCreateProposalModalOpen, setCreateProposalModalOpen] = useState(false);

  const [proposals, setProposals] = useState<readonly ProposalResponse[]>([]);
  const [clickedProposal, setClickedProposal] = useState<number>();
  const [isVotingMember, setVotingMember] = useState(false);

  const refreshProposals = useCallback(async () => {
    if (!client) return;

    try {
      const validatorVotingContract = new ValidatorVotingContractQuerier(config, client);

      const proposals = await validatorVotingContract.getAllProposals();
      setProposals(proposals);

      const isVotingMember = (await validatorVotingContract.getVoters()).some(
        (voter) => voter.addr === address,
      );
      setVotingMember(isVotingMember);
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
    } finally {
      setTableLoading(false);
    }
  }, [address, client, config, handleError]);

  useEffect(() => {
    refreshProposals();
  }, [refreshProposals]);

  return (
    <>
      <Stack style={{ width: "100%", marginTop: "var(--s2)" }}>
        <ProposalsContainer>
          <header>
            <Title level={2} style={{ fontSize: "var(--s1)" }}>
              Proposals
            </Title>
            {isVotingMember && (
              <ButtonAddNew text="Add proposal" onClick={() => setCreateProposalModalOpen(true)} />
            )}
          </header>
          <Table
            loading={isTableLoading}
            pagination={{ position: ["bottomCenter"], hideOnSinglePage: true }}
            columns={columns}
            dataSource={proposals}
            rowKey={(record: ProposalResponse) => record.id}
            onRow={(record: ProposalResponse) => ({ onClick: () => setClickedProposal(record.id) })}
          />
        </ProposalsContainer>
      </Stack>
      <ValidatorCreateProposalModal
        isModalOpen={isCreateProposalModalOpen}
        closeModal={() => setCreateProposalModalOpen(false)}
        refreshProposals={refreshProposals}
      />
      <ValidatorProposalDetailModal
        isModalOpen={!!clickedProposal}
        closeModal={() => setClickedProposal(undefined)}
        proposalId={clickedProposal}
        refreshProposals={refreshProposals}
      />
    </>
  );
}
