import styled from "styled-components";
import { Col, Row, Typography } from "antd";
import { InputNumber } from "formik-antd";

export const StyledInput = styled(InputNumber)`
  width: 100%;
  border-radius: var(--border-radius);
  color: var(--color-button-2ary);
  .ant-input-number-input {
    font-size: 1rem;
    text-align: end;
  }
  .ant-input-number-handler-wrap {
    display: none;
  }

  &.ant-input-number:hover {
    color: var(--color-text-1ary);
  }

  &.ant-input-number:focus {
    border-color: var(--bg-button-1ary);
  }

  .ant-input-number-input:focus {
    color: var(--color-text-1ary);
  }
`;
export const TokenContainer = styled(Row)`
  &.positionTop {
    &::after {
      position: absolute;
      content: "";
      display: block;
      width: 80px;
      height: 80px;
      background-color: var(--bg-body);
      border-radius: 100%;
      left: 50%;
      transform: translate(-50%, 90%);
      z-index: 2;
      box-shadow: 0px -1px 0.2px rgba(0, 0, 0, 0.07);
    }
    &.error::after {
      border-top: 1px solid rgba(255, 100, 101, 0.6);
    }
  }
  &.positionBottom {
    &::after {
      position: absolute;
      content: "";
      display: block;
      width: 80px;
      height: 80px;
      background-color: var(--bg-body);
      border-radius: 100%;
      left: 50%;
      transform: translate(-50%, -101%);
      z-index: 2;
      box-shadow: 0px 1px 0.4px rgba(0, 0, 0, 0.07);
    }
    &.error::after {
      border-bottom: 1px solid rgba(255, 100, 101, 0.6);
    }
  }

  &.ant-row {
    background: white;
    height: 104px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.07);
    padding: var(--s0);
    margin: 0 !important;
    border-radius: calc(var(--border-radius) + 10px);
    border: 1px solid transparent;
    &.error {
      border: 1px solid rgba(255, 100, 101, 0.6);
    }
  }
`;
export const MaxContainer = styled(Col)`
  justify-content: center;
  align-items: center;
  display: flex;
`;

export const BalanceParagraph = styled(Typography.Paragraph)`
  &.ant-typography {
    text-align: end;
    font-size: calc(var(--s-3) + var(--s-6));
    color: var(--color-button-2ary);
  }
`;

export const TitleParagraph = styled(Typography.Paragraph)`
  &.ant-typography {
    text-align: start;
    color: var(--color-text-1ary);
    font-weight: 700;
    font-size: var(--s-1);
  }
`;
export const ErrorContainer = styled(Typography.Paragraph)`
  &.ant-typography {
    position: absolute;
    right: var(--s3);
    z-index: 999;
    text-align: end;
    color: hsl(360, 100%, 70%);
    font-size: calc(var(--s0) * 0.85);
  }
`;
