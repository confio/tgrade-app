import { Steps } from "antd";
import styled from "styled-components";

export default styled(Steps)`
  max-width: 10rem;

  & .ant-steps-item-icon {
    margin: 0;
    background-color: lightgray:
    border-color: transparent;
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
      background-color: white;
    }
  }



  & .ant-steps-item-active{
    
    & .ant-steps-item-icon {
      .ant-steps-icon{color:var(--color-primary);}
      background-color:white;
      border-color: var(--color-primary);
    }
  }


  & .ant-steps-item-finish {
    & .ant-steps-item-icon {
      color: white;
      background-color:var(--color-primary);
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
