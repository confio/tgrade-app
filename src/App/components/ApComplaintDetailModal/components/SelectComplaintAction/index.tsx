import { Typography } from "antd";
import { SelectValue } from "antd/lib/select";
import { ReactComponent as DownArrow } from "App/assets/icons/down-arrow.svg";
import Select from "App/components/Select";

import { ComplaintAction, ComplaintActionStep, complaintActionTitles } from "../..";
import { ComplaintActionStack, StyledSelect } from "./style";

const { Option } = Select;
const { Text } = Typography;

interface SelectComplaintActionProps {
  readonly complaintActionStep: ComplaintActionStep;
  readonly setComplaintActionStep: React.Dispatch<React.SetStateAction<ComplaintActionStep>>;
}

export default function SelectComplaintAction({
  complaintActionStep,
  setComplaintActionStep,
}: SelectComplaintActionProps): JSX.Element {
  return (
    <>
      <ComplaintActionStack gap="s-3">
        <Text>Action</Text>
        <StyledSelect
          suffixIcon={<DownArrow />}
          defaultActiveFirstOption
          size="large"
          value={complaintActionStep.type}
          onChange={(complaintActionType: SelectValue) => {
            setComplaintActionStep({ type: complaintActionType as ComplaintAction });
          }}
        >
          {Object.values(ComplaintAction).map((complaintActionType) => (
            <Option key={complaintActionType} value={complaintActionType}>
              {complaintActionTitles[complaintActionType]}
            </Option>
          ))}
        </StyledSelect>
      </ComplaintActionStack>
    </>
  );
}
