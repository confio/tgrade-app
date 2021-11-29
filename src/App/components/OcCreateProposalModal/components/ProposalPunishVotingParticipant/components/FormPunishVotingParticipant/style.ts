import styled from "styled-components";

export const PunishmentRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--s0);

  & > div {
    max-width: 24rem;
    width: 100%;
  }
`;

export const MemberTexts = styled.div`
  display: flex;
  flex-direction: column;

  & > span.ant-typography {
    font-size: var(--s-1);
    color: var(--color-text-1ary);

    &:first-child {
      font-weight: bolder;
    }
  }
`;

export const Separator = styled.hr`
  margin: 0 -20px 0 -20px;
  border: none;
  border-top: 1px solid var(--color-input-border);
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  button:first-child {
    margin-right: var(--s0);
  }
`;
