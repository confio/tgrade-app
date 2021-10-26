import { Typography } from "antd";

import iconConfirm from "./assets/confirmationIcon.png";
import { Container, ImageContainer, Paragraph, RowContainer, TitleContainer } from "./style";

const { Title } = Typography;

const TransactionDetail = (props: { children: any }): JSX.Element => {
  return (
    <Container>
      <ImageContainer>
        <img src={iconConfirm} alt="Complete" />
      </ImageContainer>
      <TitleContainer>
        <Title>Complete!</Title>
      </TitleContainer>
      {props.children}
    </Container>
  );
};

export default TransactionDetail;

export const DetailRow = (props: { title: string; value: string | JSX.Element }): JSX.Element => {
  return (
    <RowContainer>
      <Paragraph>{props.title} </Paragraph> <Paragraph>{props.value}</Paragraph>
    </RowContainer>
  );
};
