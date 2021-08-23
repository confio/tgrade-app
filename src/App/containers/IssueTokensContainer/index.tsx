import ButtonAddNew from "App/components/ButtonAddNew";
import { ItemWrapper } from "./style";
import IssuedTokensList from "App/components/IssuedTokensList";
export default function IssueTokensContainer(): JSX.Element | null {
  return (
    <div>
      <h2 style={{ margin: "5px", fontSize: "20px" }}>Issued Tokens</h2>
      <IssuedTokensList />
      <ItemWrapper>
        <ButtonAddNew onClick={() => {}} text="Create digital asset" />
      </ItemWrapper>
    </div>
  );
}
