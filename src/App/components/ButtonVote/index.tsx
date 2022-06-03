import { Button } from "antd";
import { ReactComponent as VoteNoIcon } from "App/assets/icons/cross-circle.svg";
import { ReactComponent as VoteAbstainIcon } from "App/assets/icons/slash-circle.svg";
import { ReactComponent as VoteYesIcon } from "App/assets/icons/tick-circle.svg";
import { ComponentProps } from "react";
import { VoteOption as CpVoteOption } from "utils/communityPool";
import { VoteOption as OcVoteOption } from "utils/oversightCommunity";
import { VoteOption as TcVoteOption } from "utils/trustedCircle";
import { VoteOption as ValVoteOption } from "utils/validatorVoting";

import StyledButton from "./style";

// NOTE: Not needed, just to emphasize that this button serves for any contract proposal
type VoteOption = TcVoteOption | OcVoteOption | CpVoteOption | ValVoteOption;

function getIconFromVoteOption(vote: VoteOption): JSX.Element | undefined {
  switch (vote) {
    case "yes":
      return <VoteYesIcon />;
    case "no":
      return <VoteNoIcon />;
    case "abstain":
      return <VoteAbstainIcon />;
    default:
      return undefined;
  }
}

function getStyleFromVoteOption(vote: VoteOption): React.CSSProperties {
  switch (vote) {
    case "yes":
      return { "--btn-vote-bg": "var(--color-result-success)" } as React.CSSProperties;
    case "no":
      return { "--btn-vote-bg": "var(--bg-button-danger)" } as React.CSSProperties;
    case "abstain":
      return { "--btn-vote-bg": "var(--color-secondary)" } as React.CSSProperties;
    default:
      return {} as React.CSSProperties;
  }
}

interface ButtonVoteProps extends ComponentProps<typeof Button> {
  readonly vote: VoteOption;
}

export default function ButtonVote({ vote, ...props }: ButtonVoteProps): JSX.Element {
  return (
    <StyledButton icon={getIconFromVoteOption(vote)} style={getStyleFromVoteOption(vote)} {...props}>
      {vote.charAt(0).toUpperCase() + vote.slice(1)}
    </StyledButton>
  );
}
