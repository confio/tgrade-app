import styled from "styled-components";

export const MenuWrapper = styled.div`
  /* Position and sizing of burger button */
  & .bm-burger-button {
    display: none;
  }

  /* Color/shape of close button cross */
  & .bm-cross {
    background: white;
  }

  /* General sidebar styles */
  & .bm-menu {
    background: var(--grad-primary);
    padding: 2rem;
  }

  /* Big viewport sidebar styles */
  &[data-background-big="true"] .bm-menu {
    background: var(--color-form-focus);
  }

  /* Wrapper for item list */
  & .bm-item-list {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  /* Individual item */
  & .bm-item {
    display: inline-block;

    h3.ant-typography {
      color: white;
      margin: 0;
    }
  }
`;
