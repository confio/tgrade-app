import PageLayout from "App/components/PageLayout";
import ButtonAddNew from "App/components/ButtonAddNew";
import { paths } from "App/paths";
import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { openAddDsoModal, removeDso, useDso } from "service";
import { ReactComponent as CloseIcon } from "App/assets/icons/cross-tab.svg";
import DsoDetail from "App/components/DsoDetail";
import { StyledTabs } from "./style";

const { TabPane } = StyledTabs;

export interface DsoHomeParams {
  readonly dsoAddress: string;
}

export default function DsoHome(): JSX.Element | null {
  const history = useHistory();
  const { dsoAddress }: DsoHomeParams = useParams();
  const { dsoState, dsoDispatch } = useDso();
  const [loadedDsoAddress, setLoadedDsoAddress] = useState<string>();

  useEffect(() => {
    if (!dsoState.dsos.length) {
      history.push(paths.dso.prefix);
      return;
    }

    const dsoAddressIsStored = dsoState.dsos.some(({ address }) => address === dsoAddress);
    if (dsoAddressIsStored) {
      setLoadedDsoAddress(dsoAddress);
    } else {
      const firstDsoAddress = dsoState.dsos[0].address;
      setLoadedDsoAddress(firstDsoAddress);
    }
  }, [dsoAddress, dsoState.dsos, history]);

  return loadedDsoAddress ? (
    <PageLayout maxwidth="75rem" centered="false">
      <StyledTabs
        activeKey={loadedDsoAddress}
        tabPosition="top"
        onTabClick={(key) => history.push(`${paths.dso.prefix}/${key}`)}
        tabBarExtraContent={{
          right: <ButtonAddNew text="Add Trusted Circle" onClick={() => openAddDsoModal(dsoDispatch)} />,
        }}
        type="editable-card"
        hideAdd
        onEdit={(dsoAddress, action) => {
          if (action === "remove" && typeof dsoAddress === "string") {
            removeDso(dsoDispatch, dsoAddress);
          }
        }}
      >
        {dsoState.dsos.map(({ address, name }) => (
          <TabPane
            tab={name}
            key={address}
            closable={address === loadedDsoAddress}
            closeIcon={<CloseIcon style={{ height: ".5rem" }} />}
          >
            <DsoDetail dsoAddress={address} />
          </TabPane>
        ))}
      </StyledTabs>
    </PageLayout>
  ) : null;
}
