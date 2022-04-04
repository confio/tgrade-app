import { List } from "antd";
import styled from "styled-components";

export const StyledList = styled(List)`
  & :not(.ant-pagination-disabled) > .ant-pagination-item-link:hover {
    border-color: var(--color-primary);
  }

  & .ant-pagination-item-active,
  & .ant-pagination-item:hover {
    border-color: var(--color-primary);

    & a {
      color: var(--color-primary);
    }
  }

  & .ant-pagination-options-size-changer:hover {
    & .ant-select-selector {
      color: var(--color-primary);
      border-color: var(--color-primary);
    }

    & .ant-select-arrow {
      color: var(--color-primary);
    }
  }
`;

export const TokenListItem = styled(List.Item)`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--s-4);

  &.ant-list-item {
    margin: 0 -20px;
    padding: 10px 20px;
  }

  &:hover {
    background-color: hsla(180, 88%, 37%, 0.6);
  }
`;

export const ContainerLogoNames = styled.div`
  flex-basis: 50%;
  display: flex;
  align-items: center;
  gap: var(--s-4);
  flex-shrink: 0;

  & img {
    width: 100%;
    height: 100%;
    max-width: 32px;
    max-height: 32px;
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
  margin-right: 14px;

  display: flex;
  align-items: center;
  gap: var(--s-4);

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
