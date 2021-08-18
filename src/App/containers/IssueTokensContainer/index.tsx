import ButtonAddNew from "App/components/ButtonAddNew";
import { ItemWrapper } from "./style";
import IssuedTokensList from "App/components/IssuedTokensList";
export default function IssueTokensContainer(): JSX.Element | null {
  return (
    <div>
      <IssuedTokensList />
      <ItemWrapper>
        <ButtonAddNew onClick={() => {}} text="Create digital asset" />
      </ItemWrapper>
    </div>
  );
}
