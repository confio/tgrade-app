import { Button } from "antd";
import { ComponentProps } from "react";
import styled, { css } from "styled-components";

const ButtonCircle = ({ onClick, disabled, ...props }: ComponentProps<typeof Button>): JSX.Element => {
  return (
    <Button shape="circle" size="middle" onClick={onClick} disabled={disabled || !onClick} {...props}>
      {props.children}
    </Button>
  );
};

const StyledButtonCircle = styled(ButtonCircle)`
  color: var(--bg-button-1ary);
  width: 54px;
  height: 54px;
  background: white;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.07);
  padding: var(--s0);
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover,
  &:focus,
  &:hover:focus {
    border: 1px solid var(--color-primary);
  }

  ${(props) =>
    !props.onClick
      ? css`
          &:disabled {
            background: white;
            cursor: auto;

            &:hover,
            &:focus,
            &:hover:focus {
              background: white;
            }
          }
        `
      : ""};

  & img {
    width: 100%;
    height: 100%;
    max-width: 20px;
    max-height: 20px;
  }
`;

export default StyledButtonCircle;
