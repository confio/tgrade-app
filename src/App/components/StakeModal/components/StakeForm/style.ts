import { Typography } from "antd";
import Stack from "App/components/Stack/style";
import styled from "styled-components";

export const FormStack = styled(Stack)`
  margin: 0 20px;

  & .ant-btn {
    justify-content: center;
  }
`;

export const CurrentDataStack = styled(Stack)`
  & span.ant-typography {
    color: black;
  }
`;

export const BoldText = styled(Typography.Text)`
  font-weight: 600;
`;

export const StakeFields = styled.div`
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 20px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s2);

  & > div > .ant-form-item {
    flex-basis: 60%;
  }

  & > .ant-form-item {
    flex-basis: 40%;

    & .ant-form-item-control-input-content > div {
      justify-content: flex-end;
    }
  }

  & .ant-input {
    padding: 0;
    border: none;
    font-size: var(--s3);

    &:focus {
      box-shadow: 0 0 0 2px rgba(14, 177, 177, 0.2);
    }

    &[disabled] {
      cursor: default;
      background-color: white;
      color: black;
      text-align: end;

      &::placeholder {
        color: black;
      }
    }
  }

  & .ant-row {
    margin: 0;
  }

  & [id^="label-id"] {
    font-size: var(--s-1);
    font-weight: 600;
  }
`;
