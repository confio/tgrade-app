import { Typography } from "antd";
import Button from "App/components/form/Button";
import { PageLayout, Stack } from "App/components/layout";
import * as React from "react";
import { useEffect, useState } from "react";
import { setInitialLayoutState, useLayout } from "service";
import CreateDsoModal from "./CreateDsoModal";

const { Text } = Typography;

export default function Home(): JSX.Element {
  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch, { showCorporateBanner: true, menuState: "hidden" }), [
    layoutDispatch,
  ]);

  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <PageLayout>
      <Stack gap="s4">
        <Text>Future DSO home</Text>
        <Button onClick={() => setModalVisible(true)}>
          <div>Create DSO</div>
        </Button>
        <CreateDsoModal visible={isModalVisible} closeModal={() => setModalVisible(false)} />
      </Stack>
    </PageLayout>
  );
}
