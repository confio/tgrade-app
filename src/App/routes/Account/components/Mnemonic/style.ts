import { Typography } from "antd";
import styled from "styled-components";

const { Text } = Typography;

export const MnemonicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr));
  grid-gap: var(--s-3);

  & > div {
    padding: var(--s-1);
    color: white;
    background: var(--grad-button-default);
    border-radius: var(--border-radius);
    font-family: var(--ff-iceland);
    font-size: var(--s0);
  }
`;

export const WarningText = styled(Text)`
  &.ant-typography {
    font-family: var(--ff-iceland);
    font-size: var(--s1);
  }
`;
