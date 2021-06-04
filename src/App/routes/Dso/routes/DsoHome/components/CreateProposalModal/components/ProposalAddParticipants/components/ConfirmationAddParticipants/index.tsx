import { Tag } from "antd";
import Button from "App/components/form/Button";
import * as React from "react";
import { useSdk } from "service";
import { isValidAddress } from "utils/forms";
import { ellipsifyAddress } from "utils/ui";
import { ButtonGroup } from "./style";

interface ConfirmationAddParticipantsProps {
  readonly members: readonly string[];
  readonly isSubmitting: boolean;
  readonly goBack: () => void;
  readonly submitForm: () => void;
}

export default function ConfirmationAddParticipants({
  members,
  isSubmitting,
  goBack,
  submitForm,
}: ConfirmationAddParticipantsProps): JSX.Element {
  const {
    sdkState: {
      config: { addressPrefix },
    },
  } = useSdk();

  return (
    <>
      <div>
        {members.map((memberAddress, index) => (
          <Tag
            key={`${index}-${memberAddress}`}
            color={isValidAddress(memberAddress, addressPrefix) ? "default" : "error"}
          >
            {ellipsifyAddress(memberAddress)}
          </Tag>
        ))}
      </div>
      <ButtonGroup>
        <Button disabled={isSubmitting} onClick={() => goBack()}>
          <div>Back</div>
        </Button>
        <Button loading={isSubmitting} onClick={() => submitForm()}>
          <div>Create proposal</div>
        </Button>
      </ButtonGroup>
    </>
  );
}
