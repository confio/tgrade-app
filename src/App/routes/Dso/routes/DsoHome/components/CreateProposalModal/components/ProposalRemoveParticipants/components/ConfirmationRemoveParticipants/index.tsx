import { Typography } from "antd";
import { AddressList } from "App/components/form/AddressList";
import Button from "App/components/form/Button";
import { BackButtonOrLink } from "App/components/logic";
import * as React from "react";
import { useSdk } from "service";
import { AddressStack, ButtonGroup, Separator, TextComment } from "./style";

const { Text } = Typography;

interface ConfirmationRemoveParticipantsProps {
  readonly members: readonly string[];
  readonly comment: string;
  readonly isSubmitting: boolean;
  readonly goBack: () => void;
  readonly submitForm: () => void;
}

export default function ConfirmationRemoveParticipants({
  members,
  comment,
  isSubmitting,
  goBack,
  submitForm,
}: ConfirmationRemoveParticipantsProps): JSX.Element {
  const {
    sdkState: {
      config: { addressPrefix },
    },
  } = useSdk();

  return (
    <>
      <AddressStack gap="s-3">
        <Text>Non voting participant(s) to be removed</Text>
        <AddressList addresses={members} addressPrefix={addressPrefix} />
      </AddressStack>
      <TextComment>{comment}</TextComment>
      <Separator />
      <ButtonGroup>
        <BackButtonOrLink disabled={isSubmitting} onClick={() => goBack()} text="Back" />
        <Button loading={isSubmitting} onClick={() => submitForm()}>
          <div>Confirm proposal</div>
        </Button>
      </ButtonGroup>
    </>
  );
}
