import { Typography } from "antd";
import Stack from "App/components/Stack/style";
import styled from "styled-components";

const { Text } = Typography;

export const ConfirmField = styled.div`
  & span.ant-typography {
    font-size: var(--s0);
    color: var(--color-text-1ary);

    &:first-child {
      font-weight: 500;
    }
  }
`;

export const AddressStack = styled(Stack)`
  & span.ant-typography {
    font-size: var(--s0);
    color: var(--color-text-1ary);
    font-weight: 500;
  }
`;

export const TextComment = styled(Text)`
  && {
    color: var(--color-text-1ary);
  }
`;

export const Separator = styled.hr`
  margin: 0 -20px 0 -20px;
  border: none;
  border-top: 1px solid var(--color-input-border);
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

  & > *:first-child {
    margin-right: var(--s0);
  }
`;

export const FeeGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  & > *:first-child {
    margin-right: var(--s0);
  }
`;

export const Heading = styled.h2`
  font-family: Quicksand;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
`;
