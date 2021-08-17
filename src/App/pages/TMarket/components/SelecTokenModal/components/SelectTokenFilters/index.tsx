import React from "react";
import { Checkbox, Row } from "antd";

const CheckboxGroup = Checkbox.Group;

const plainOptions = ["Available only", "Trusted Circle associated", "Public only"];
const defaultCheckedList = ["All"];

const SelectTokenFilters = (): JSX.Element => {
  const [checkedList, setCheckedList] = React.useState<Array<any>>(defaultCheckedList);
  const [indeterminate, setIndeterminate] = React.useState(true);
  const [checkAll, setCheckAll] = React.useState(false);

  const onChange = (list: any) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };

  const onCheckAllChange = (e: any) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  return (
    <Row style={{ padding: "var(--s0)" }} justify="center">
      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
        All
      </Checkbox>
      <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
    </Row>
  );
};
export default SelectTokenFilters;
