import { Typography } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import { StyledModalHeader } from "./style";

const { Title } = Typography;

interface ModalHeaderProps {
  readonly title: string;
  readonly isSubmitting: boolean;
  readonly closeModal: () => void;
}

export default function ModalHeader({ title, isSubmitting, closeModal }: ModalHeaderProps): JSX.Element {
  return (
    <StyledModalHeader>
      <Typography>
        <Title>{title}</Title>
      </Typography>
      {!isSubmitting ? <img alt="Close button" src={closeIcon} onClick={() => closeModal()} /> : null}
    </StyledModalHeader>
  );
}
