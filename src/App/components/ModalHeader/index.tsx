import { Typography } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import { HTMLAttributes } from "react";

import { StyledModalHeader } from "./style";

const { Title } = Typography;

interface ModalHeaderProps extends HTMLAttributes<HTMLOrSVGElement> {
  readonly title: string;
  readonly isSubmitting: boolean;
  readonly closeModal: () => void;
}

export default function ModalHeader({
  title,
  children,
  isSubmitting,
  closeModal,
}: ModalHeaderProps): JSX.Element {
  return (
    <StyledModalHeader>
      <Typography>
        <Title>{title}</Title>
      </Typography>
      {children}
      {!isSubmitting ? <img alt="Close button" src={closeIcon} onClick={() => closeModal()} /> : null}
    </StyledModalHeader>
  );
}
