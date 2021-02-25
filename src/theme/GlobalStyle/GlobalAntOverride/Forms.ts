import { createGlobalStyle } from "styled-components";

export const Forms = createGlobalStyle`
  .ant-form {
    div[role="alert"] li {
      color: var(--form-error);
      font-size: var(--s-1);
      text-align: left;
      margin: var(--s-1);
    
      &::before {
        content: "* ";
      }
    }

    .ant-input:focus {
      border-radius: 20px;
    }

    .ant-form-item-has-error {
      & .ant-input:not(.ant-form-item-has-error .ant-input-disabled) {
        background: none;
      }

      .ant-input-group,
      .ant-form-item-control-input-content {
        color: var(--color-red);
        border: 1px solid var(--color-red);

        &:focus-within {
          color: var(--color-red);
          border: 1px solid var(--color-red);
        }
      }
    }

    .ant-input-group,
    .ant-form-item-control-input-content,
    .ant-transfer-list-body-search-wrapper {
      color: #43547d;
      border: 1px solid #43547d;
      border-radius: 20px;

      &:hover {
        color: #f9b77a;
        border: 1px solid #f9b77a;
      }

      &:focus-within {
        color: #7c95ff;
        border: 1px solid #7c95ff;
      }
    }

    .ant-form-item {
      &[data-disabled=true] {
        .ant-form-item-control-input-content {
          color: #828282;
          background-color: #333333;
          border-color: #333333;
        }
      }
    }

    .ant-transfer-list-body-search-wrapper:hover .anticon-search svg {
      color: #f9b77a;
    }

    .ant-transfer-list-body-search-wrapper:focus-within .anticon-search svg {
      color: #7c95ff;
    }


    .ant-input-search-enter-button input + .ant-input-group-addon {
      border-left: 1px solid;
    }

    .ant-input-group-addon {
      background: none;
      color: inherit;
    }

    .ant-input,
    .ant-select-selector.ant-select-selector {
      min-height: 4rem;
      text-overflow: ellipsis;
      background: none;
      border: none;
      color: inherit;

      &::placeholder {
        color: inherit;
      }
    }

    .ant-select,
    .ant-select-selection-search,
    .ant-select-selection-item {
      color: #43547d;

      &:hover {
        color: #f9b77a;
      }

      &:focus-within {
        color: #7c95ff;
      }

      & svg {
        color: inherit;
      }
    }

    .ant-select-selection-item {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ant-input-search-button {
      width: auto;
      min-height: 4rem;

      background: none;
      color: inherit;

      &::after {
        display: none;
      }

      &:focus,
      &:focus:hover {
        background: none;
        border: 1px solid transparent;
      }

      & svg {
        color: inherit;
      }
    }

    .ant-transfer-list {
      border: none;
      color: #7c95ff;

      .ant-transfer-list-header {
        background: none;
        border-bottom: 1px solid #43547d;

        span {
          color: #7c95ff;
        }
      }

      .ant-transfer-list-body-search-wrapper {
        margin: 0.625rem;
      }

      .ant-input {
        min-height: 0;
      }

      .ant-transfer-list-search-action svg {
        color: #7c95ff;
      }

      .ant-checkbox-checked .ant-checkbox-inner {
        background-color: #7c95ff;
        border-color: #7c95ff;
      }

      .ant-checkbox-indeterminate .ant-checkbox-inner::after {
        background-color: #7c95ff;
        border-color: #7c95ff;
      }

      .ant-transfer-list-content-item,
      .ant-transfer-list-content-item-checked {
        background: none;

        &:hover {
          background: none;
          color: #f9b77a;          
        }
      }

      .ant-empty-description {
        color: var(--color-red);
      }
    }
  }
`;
