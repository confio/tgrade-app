import { List } from "antd";
import styled from "styled-components";

export const TokenListItem = styled(List.Item)`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--s-2);

  &.ant-list-item {
    margin: 0 -20px;
    padding: 10px 20px;
  }

  &:hover {
    background-color: hsla(180, 88%, 37%, 0.6);
  }
`;

export const ContainerLogoNames = styled.div`
  display: flex;
  align-items: center;
  gap: var(--s-2);
  flex-shrink: 0;

  & img {
    height: 32px;
  }
`;

export const ContainerNames = styled.div`
  & div.ant-typography {
    font-size: var(--s-1);

    &:first-child {
      font-size: var(--s0);
      font-weight: 700;
      color: var(--color-text-1ary);
    }
  }
`;

export const ContainerNumbersPin = styled.div`
  display: flex;
  align-items: center;
  gap: var(--s-2);

  img {
    cursor: pointer;
    height: 16px;
  }
`;

export const ContainerNumbers = styled.div`
  & div.ant-typography {
    text-align: end;
    font-size: var(--s-1);

    &:first-child {
      font-size: var(--s0);
      font-weight: 700;
      color: var(--color-text-1ary);
    }
  }
`;
