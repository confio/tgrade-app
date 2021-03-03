import { Typography } from "antd";
import styled from "styled-components";

const { Text } = Typography;

export const ResultIcon = styled.img`
  width: 6.25rem;
  align-self: center;
`;

export const ResultText = styled(Text)`
  && {
    font-size: var(--s-1);

    &[data-result="success"] {
      color: var(--color-green);
    }

    &[data-result="failure"] {
      color: var(--color-red);
    }
  }
`;
