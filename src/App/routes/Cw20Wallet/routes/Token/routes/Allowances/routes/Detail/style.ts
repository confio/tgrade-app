import { Typography } from "antd";
import styled from "styled-components";

const { Text } = Typography;

export const AddressText = styled(Text)`
  && {
    font-size: var(--s0);
    font-family: var(--ff-iceland);
  }
`;

export const Amount = styled.div`
  & span.ant-typography {
    font-size: var(--s2);
    font-family: var(--ff-iceland);

    & + span.ant-typography {
      font-size: var(--s1);
    }
  }
`;
