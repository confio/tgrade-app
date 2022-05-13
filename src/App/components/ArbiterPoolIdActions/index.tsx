import { Dropdown, Menu } from "antd";
import gearIcon from "App/assets/icons/gear.svg";
import AddressTag from "App/components/AddressTag";
import { openLeaveOcModal, useOc } from "service";

import { ActionsButton, Separator, StyledOcIdActions } from "./style";

export default function ArbiterPoolIdActions(): JSX.Element {
  const {
    ocState: { ocAddress },
    ocDispatch,
  } = useOc();

  return (
    <StyledOcIdActions>
      <header>
        <div className="address-actions-container">
          <AddressTag address={ocAddress || ""} copyable />
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1" onClick={() => openLeaveOcModal(ocDispatch)}>
                  Leave Oversight Community
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <ActionsButton alt="Actions button" src={gearIcon} />
          </Dropdown>
        </div>
      </header>
      <Separator />
    </StyledOcIdActions>
  );
}
