import { HTMLAttributes } from "react";
import Tooltip from "../Tooltip";
import StyledTooltipWrapper from "./style";

interface TooltipWrapperProps extends HTMLAttributes<HTMLOrSVGElement> {
  readonly title: string;
}

export default function TooltipWrapper({ title, children, ...restProps }: TooltipWrapperProps): JSX.Element {
  return (
    <StyledTooltipWrapper {...restProps}>
      {children}
      <Tooltip title={title} />
    </StyledTooltipWrapper>
  );
}
