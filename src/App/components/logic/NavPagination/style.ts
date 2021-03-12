import { Pagination } from "antd";
import styled from "styled-components";

export const StyledPagination = styled(Pagination)`
  .ant-pagination-simple-pager {
    color: var(--color-form);

    & input {
      background: none;
      border-color: var(--color-form);
      border-radius: 1rem;

      &:hover {
        color: var(--color-hover);
        border-color: currentColor;
      }

      &:focus {
        color: var(--color-form-focus);
        border-color: currentColor;
      }
    }
  }

  .ant-pagination-prev,
  .ant-pagination-next {
    & svg {
      color: var(--color-form-focus);

      &:hover {
        color: var(--color-hover);
      }
    }

    &.ant-pagination-disabled svg {
      color: var(--color-form);
    }
  }
`;
