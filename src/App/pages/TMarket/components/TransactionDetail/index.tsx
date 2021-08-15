import {
  Title,
  ImageContainer,
  TitleContainer,
  Container,
  Paragraph,
  ParagraphStrong,
  RowContainer,
} from "./style";
import iconConfirm from "./assets/confirmationIcon.png";

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
      <Paragraph>{props.title} </Paragraph> <ParagraphStrong>{props.value}</ParagraphStrong>
    </RowContainer>
  );
};
