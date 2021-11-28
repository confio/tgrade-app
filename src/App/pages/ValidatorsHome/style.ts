import Stack from "App/components/Stack/style";
import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  margin: 25px;
`;

export const TextStack = styled(Stack)`
  max-width: 80ch;
  align-items: flex-start;

  & .ant-typography {
    text-align: left;
  }
`;
