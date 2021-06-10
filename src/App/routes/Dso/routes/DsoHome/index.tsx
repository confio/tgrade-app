import { Tabs } from "antd";
import Button from "App/components/form/Button";
import { PageLayout, Stack } from "App/components/layout";
import { paths } from "App/paths";
import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { openAddDsoModal, setInitialLayoutState, useDso, useLayout } from "service";
import CreateProposalModal from "./components/CreateProposalModal";
import DsoDetail from "./components/DsoDetail";

const { TabPane } = Tabs;

export interface DsoHomeParams {
  readonly dsoAddress: string;
}

export default function DsoHome(): JSX.Element | null {
  const history = useHistory();
  const { dsoAddress }: DsoHomeParams = useParams();
  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch, { showCorporateBanner: true, menuState: "hidden" }), [
    layoutDispatch,
  ]);

  const { dsoState, dsoDispatch } = useDso();
  const [loadedDsoAddress, setLoadedDsoAddress] = useState<string>();
  const [isCreateProposalModalOpen, setCreateProposalModalOpen] = useState(false);

  useEffect(() => {
    const noStoredDsos = !dsoState.dsos.length;
    if (noStoredDsos) history.push(paths.dso.prefix);

    const dsoAddressIsStored = dsoState.dsos.some(([address]) => address === dsoAddress);
    if (dsoAddressIsStored) {
      setLoadedDsoAddress(dsoAddress);
    } else {
      setLoadedDsoAddress(dsoState.dsos[0][0]);
    }
  }, [dsoAddress, dsoState.dsos, history]);

  return loadedDsoAddress ? (
    <PageLayout>
      <Stack gap="s4">
        <Tabs
          destroyInactiveTabPane
          activeKey={loadedDsoAddress}
          tabPosition="top"
          onTabClick={(key) => history.push(`${paths.dso.prefix}/${key}`)}
        >
          {dsoState.dsos.map(([dsoAddress, dsoName]) => (
            <TabPane tab={dsoName} key={dsoAddress}>
              <DsoDetail dsoAddress={dsoAddress} />
            </TabPane>
          ))}
        </Tabs>
        <Button onClick={() => openAddDsoModal(dsoDispatch)}>
          <div>Add DSO</div>
        </Button>
        <Button onClick={() => setCreateProposalModalOpen(true)}>
          <div>Create proposal</div>
        </Button>
      </Stack>
      <CreateProposalModal
        isModalOpen={isCreateProposalModalOpen}
        closeModal={() => setCreateProposalModalOpen(false)}
      />
    </PageLayout>
  ) : null;
}
