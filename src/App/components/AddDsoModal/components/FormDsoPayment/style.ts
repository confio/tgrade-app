import { Typography } from "antd";
import Stack from "App/components/Stack/style";
import styled from "styled-components";

export const FormStack = styled(Stack)`
  & .ant-btn {
    align-self: flex-end;
  }
`;

export const Separator = styled.hr`
  margin: 0 -20px 0 -20px;
  border: none;
  border-top: 1px solid var(--color-input-border);
`;

export const FeeGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;

  & > * + * {
    margin-left: var(--s0);
  }
`;

export const FeeField = styled(Typography)`
  margin-top: var(--s-1);
  font-size: 13px;
  && > span.ant-typography {
    display: block;
    color: var(--color-text-1ary);

    & + span.ant-typography {
      font-weight: 500;
      font-size: 13px;
    }
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
