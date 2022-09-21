import Stack from "App/components/Stack/style";
import styled from "styled-components";

export const TokenDetailStack = styled(Stack)`
  span.ant-typography {
    color: black;
  }
`;

export const PinTokenBalance = styled.div`
  display: flex;
  align-items: center;
  gap: var(--s0);

  & img[alt="Pin token"],
  & img[alt="Unpin token"] {
    cursor: pointer;
    height: 16px;
  }

  & img[alt="Token logo"] {
    width: 100%;
    height: 100%;
    max-width: 52px;
    max-height: 52px;
  }
`;

export const TcData = styled.div`
  * + * {
    margin-left: var(--s-2);
  }
`;
