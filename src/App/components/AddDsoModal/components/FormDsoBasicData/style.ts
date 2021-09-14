import { Typography } from "antd";
import TooltipWrapper from "App/components/TooltipWrapper";
import styled from "styled-components";

const { Text } = Typography;

export const StyledTooltipWrapper = styled(TooltipWrapper)`
  margin-top: 0;
`;

export const WarningText = styled(Text)`
  && {
    color: var(--color-error-form);
  }
`;

export const Separator = styled.hr`
  margin: 0 -20px 0 -20px;
  border: none;
  border-top: 1px solid var(--color-input-border);
`;

export const FieldGroup = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  & .ant-form-item {
    flex-basis: 18rem;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  button:first-child {
    margin-right: var(--s0);
  }
`;
