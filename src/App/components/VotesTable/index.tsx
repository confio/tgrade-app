import Table from "App/components/Table";
import { VoteInfo as OcVoteInfo } from "utils/oversightCommunity";
import { VoteInfo as TcVoteInfo } from "utils/trustedCircle";
import { VoteInfo as ValVoteInfo } from "utils/validatorVoting";

import voteNoIcon from "../../assets/icons/circle-cross.svg";
import voteAbstainIcon from "../../assets/icons/circle-slash.svg";
import voteYesIcon from "../../assets/icons/circle-tick.svg";
import AddressTag from "../AddressTag";

type VoteInfo = TcVoteInfo | OcVoteInfo | ValVoteInfo;

const columns = [
  {
    title: "Voter",
    key: "voter",
    render: (record: VoteInfo) => {
      return <AddressTag address={record.voter} copyable />;
    },
  },
  {
    title: "Vote",
    key: "vote",
    render: (record: VoteInfo) => {
      const voteIcon =
        record.vote === "yes" ? voteYesIcon : record.vote === "no" ? voteNoIcon : voteAbstainIcon;
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img alt="Vote icon" src={voteIcon} style={{ height: "var(--s0)" }} />
          <p style={{ marginLeft: "var(--s-4)" }}>
            {record.vote.charAt(0).toUpperCase() + record.vote.slice(1)}
          </p>
        </div>
      );
    },
  },
];

interface VotesTableProps {
  readonly isLoading: boolean;
  readonly votes: readonly VoteInfo[];
}

export default function VotesTable({ isLoading, votes }: VotesTableProps): JSX.Element {
  return (
    <Table
      loading={isLoading}
      rowKey={(record: any) => record?.voter}
      pagination={{ position: ["bottomCenter"], hideOnSinglePage: true }}
      columns={columns}
      dataSource={votes}
    />
  );
}
