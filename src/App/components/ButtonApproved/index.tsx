import { Button } from "antd";
import styled from "styled-components";

//TODO: add variables
export default styled(Button)`
  border-radius: 50px;
  border: black;
  width: calc(50% - (var(--s0)));
  margin: 0 calc(var(--s0) / 2);
  min-height: 52px;
  font-family: var(--ff-text);
  border: 1px solid rgb(134, 146, 166);
  color: rgb(134, 146, 166);
  :hover {
    color: black;
    border: 1px solid black;
  }
`;
