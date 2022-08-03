import Button from "App/components/Button";

interface FormAcceptComplaintProps {
  readonly handleSubmit: () => void;
}

export default function FormAcceptComplaint({ handleSubmit }: FormAcceptComplaintProps): JSX.Element {
  return (
    <Button onClick={() => handleSubmit()}>
      <div>Accept Complaint</div>
    </Button>
  );
}
