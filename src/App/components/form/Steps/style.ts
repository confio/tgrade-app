import { Steps } from "antd";
import styled from "styled-components";

export const StyledSteps = styled(Steps)`
  max-width: 10rem;

  & .ant-steps-item-icon {
    margin: 0;
    background-color: var(--color-form-disabled);
    border-color: var(--color-form-disabled);
  }

  & .ant-steps-item {
    & .ant-steps-icon {
      top: -1px;
    }

    & .ant-steps-item-content .ant-steps-item-title::after {
      height: 3px;
      top: 10.5px;
    }
  }

  & .ant-steps-item-wait {
    & .ant-steps-icon {
      color: black;
    }
  }

  & .ant-steps-item-active,
  & .ant-steps-item-finish {
    & .ant-steps-item-icon {
      background-color: var(--color-primary);
      border-color: var(--color-primary);
    }

    & .ant-steps-icon {
      color: white;
    }
  }

  & .ant-steps-item-finish {
    & .ant-steps-item-content .ant-steps-item-title::after {
      background-color: var(--color-primary);
    }
  }
`;
