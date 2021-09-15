import { Tag } from "antd";
import styled from "styled-components";

export default styled(Tag)`
  cursor: ${(props) => (props.icon === undefined ? "auto" : "pointer")};
  display: inline-flex;
  align-items: center;
  font-family: Quicksand;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0em;
  text-align: left;
  border-radius: var(--border-radius);

  img {
    height: 0.625rem;
  }

  span {
    margin-left: var(--s-4);
  }

  .your-address {
    color: var(--color-text-2ary);
  }
`;
