import { Typography } from "antd";
import Button from "App/components/Button";
import { useSdk } from "service";
import { Complaint } from "utils/arbiterPool";

const { Text } = Typography;

interface FormAcceptComplaintProps {
  readonly complaint: Complaint | undefined;
  readonly handleSubmit: () => void;
}

export default function FormAcceptComplaint({
  handleSubmit,
  complaint,
}: FormAcceptComplaintProps): JSX.Element {
  const {
    sdkState: { address },
  } = useSdk();

  const complaintIsNotInitiated = !complaint?.state.initiated;
  const userIsNotDefendant = !address || complaint?.defendant !== address;

  return (
    <>
      {complaintIsNotInitiated ? (
        <Text style={{ color: "var(--color-error-form)" }}>
          The complaint must be on state "initiated" to be accepted
        </Text>
      ) : null}
      {userIsNotDefendant ? (
        <Text style={{ color: "var(--color-error-form)" }}>
          The complaint can only be accepted by its defendant
        </Text>
      ) : null}
      <Button disabled={complaintIsNotInitiated || userIsNotDefendant} onClick={() => handleSubmit()}>
        <div>Accept Complaint</div>
      </Button>
    </>
  );
}
