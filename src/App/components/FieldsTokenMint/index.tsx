import { Typography } from "antd";
import { SelectValue } from "antd/lib/select";
import Field from "App/components/Field";
import { FormSelect } from "App/components/Select";
import { useState } from "react";
import { getFormItemName } from "utils/forms";
import TooltipWrapper from "../TooltipWrapper";
import { MintStack, StyledFieldsTokenMint } from "./style";

const { Text } = Typography;
const { Option } = FormSelect;

export enum MintType {
  None = "none",
  Fixed = "fixed",
  Unlimited = "unlimited",
}

interface FieldsTokenMintProps {
  readonly mintLabel: string;
  readonly mintCapLabel: string;
}

export default function FieldsTokenMint({ mintLabel, mintCapLabel }: FieldsTokenMintProps): JSX.Element {
  const [selectedMint, setSelectedMint] = useState(MintType.None);

  return (
    <StyledFieldsTokenMint>
      <MintStack gap="s0">
        <TooltipWrapper title="Minting strategy for the token">
          <Text>Mint</Text>
        </TooltipWrapper>
        <FormSelect
          name={getFormItemName(mintLabel)}
          defaultActiveFirstOption
          size="large"
          value={selectedMint}
          onChange={(mintType: SelectValue) => setSelectedMint(mintType as MintType)}
        >
          <Option value={MintType.None}>None</Option>
          <Option value={MintType.Fixed}>Fixed</Option>
          <Option value={MintType.Unlimited}>Unlimited</Option>
        </FormSelect>
      </MintStack>
      <Field label={mintCapLabel} placeholder="Enter mint cap" disabled={selectedMint !== "fixed"} />
    </StyledFieldsTokenMint>
  );
}
