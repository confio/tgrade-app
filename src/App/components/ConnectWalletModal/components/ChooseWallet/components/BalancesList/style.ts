import { Input } from "antd";
import styled from "styled-components";

export const SearchToken = styled(Input.Search)`
  .ant-input-wrapper {
    .ant-input-affix-wrapper:not(:last-child) {
      //   padding: 13px 0 13px 20px;
      border-radius: var(--s0) 0 0 var(--s0);
      border-right: none;
    }
    .ant-input-group-addon {
      .ant-btn {
        &.ant-btn-icon-only {
          border-left: none;
          border-radius: 0 var(--s0) var(--s0) 0;
          //   padding: 13px 20px 13px 0;
        }
      }
    }
  }
`;

export const BalancesContainer = styled.div`
  overflow-y: auto;
  border-top: 1px solid var(--color-border);
  padding: 1px;
  padding-top: var(--s0);
`;

export const BalancesItem = styled.div`
  padding: 5px;
  border: 1px solid transparent;
  border-radius: var(--border-radius);

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  &:hover {
    cursor: pointer;
    border-color: var(--color-primary);
  }

  & .ant-typography {
    color: black;
  }
`;

export const TokenLogoName = styled.div`
  display: flex;
  align-items: center;
  gap: var(--s0);
  flex-grow: 1;

  & img {
    max-width: 30px;
    max-height: 30px;
  }
`;

export const TokenDetailPin = styled.div`
  display: flex;
  align-items: center;
  gap: var(--s0);

  & div {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  & .ant-typography:first-of-type {
    font-weight: bolder;
  }

  & .ant-typography:not(:first-of-type) {
    font-size: var(--s-1);
  }

  & .anticon-copy {
    color: var(--color-primary);
  }

  img:not(.anticon-copy) {
    cursor: pointer;
    height: 16px;
  }
`;
