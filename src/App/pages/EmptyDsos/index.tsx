import { Typography } from "antd";
import ButtonAddNew from "App/components/ButtonAddNew";
import PageLayout from "App/components/PageLayout";
import { paths } from "App/paths";
import * as React from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { openAddDsoModal, useDso } from "service";

import { StyledStack } from "./style";

const { Text } = Typography;

export default function EmptyDsos(): JSX.Element {
  const history = useHistory();

  const { dsoState, dsoDispatch } = useDso();

  useEffect(() => {
    if (!dsoState.dsos.length) return;

    const firstStoredDsoAddress = dsoState.dsos[0].address;
    history.push(`${paths.dso.prefix}/${firstStoredDsoAddress}`);
  }, [dsoState.dsos, history]);

  return (
    <PageLayout>
      <StyledStack gap="s4">
        <Text>You have no Trusted Circles connected to your local profile.</Text>
        <ButtonAddNew
          onClick={() => openAddDsoModal(dsoDispatch)}
          text="Add Trusted Circle"
          data-cy="trusted-circle-page-add-trusted-circle-button"
        />
      </StyledStack>
    </PageLayout>
  );
}
