import { Typography } from "antd";
import { Button } from "App/components/form";
import { PageLayout } from "App/components/layout";
import { paths } from "App/paths";
import * as React from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { openAddDsoModal, setInitialLayoutState, useDso, useLayout } from "service";
import { StyledStack } from "./style";

const { Text } = Typography;

export default function EmptyDsos(): JSX.Element {
  const history = useHistory();

  const { dsoState, dsoDispatch } = useDso();

  useEffect(() => {
    const noStoredDsos = !dsoState.dsos.length;
    if (noStoredDsos) return;

    const firstStoredDsoAddress = dsoState.dsos[0].address;
    history.push(`${paths.dso.prefix}/${firstStoredDsoAddress}`);
  }, [dsoState.dsos, history]);

  return (
    <PageLayout>
      <StyledStack gap="s4">
        <Text>You don't have any Trusted Circle</Text>
        <Button onClick={() => openAddDsoModal(dsoDispatch)}>
          <div>Add Trusted Circle</div>
        </Button>
      </StyledStack>
    </PageLayout>
  );
}
