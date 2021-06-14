import { Typography } from "antd";
import Button from "App/components/form/Button";
import { PageLayout, Stack } from "App/components/layout";
import { paths } from "App/paths";
import * as React from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { openAddDsoModal, setInitialLayoutState, useDso, useLayout } from "service";

const { Text } = Typography;

export default function EmptyDsos(): JSX.Element {
  const history = useHistory();
  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch, { showCorporateBanner: true, menuState: "hidden" }), [
    layoutDispatch,
  ]);
  const { dsoState, dsoDispatch } = useDso();

  useEffect(() => {
    const noStoredDsos = !dsoState.dsos.length;
    if (noStoredDsos) return;

    const firstStoredDsoAddress = dsoState.dsos[0].address;
    history.push(`${paths.dso.prefix}/${firstStoredDsoAddress}`);
  }, [dsoState.dsos, history]);

  return (
    <PageLayout>
      <Stack gap="s4">
        <Text>You don't have any dso</Text>
        <Button onClick={() => openAddDsoModal(dsoDispatch)}>
          <div>Add DSO</div>
        </Button>
      </Stack>
    </PageLayout>
  );
}
