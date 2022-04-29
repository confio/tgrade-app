import { ComponentProps } from "react";

import questionBubbleIcon from "../../assets/icons/question-bubble.svg";
import StyledTooltip from "./style";

type TooltipProps = ComponentProps<typeof StyledTooltip>;

export default function Tooltip({ ...props }: TooltipProps): JSX.Element {
  return (
    <StyledTooltip color="var(--color-info)" {...props}>
      <img alt="Tooltip" src={questionBubbleIcon} />
    </StyledTooltip>
  );
}
