import Tooltip from "../Tooltip";
import StyledTooltipWrapper from "./style";

interface TooltipWrapperProps {
  readonly title: string | JSX.Element;
  readonly children: JSX.Element;
}

export default function TooltipWrapper({ title, children, ...restProps }: TooltipWrapperProps): JSX.Element {
  return (
    <StyledTooltipWrapper {...restProps}>
      {children}
      <Tooltip title={title} />
    </StyledTooltipWrapper>
  );
}
