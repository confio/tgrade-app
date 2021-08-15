import ButtonAddNew from "App/components/ButtonAddNew";
import IssuedTokensList from "App/components/IssuedTokensList";
export default function IssueTokensContainer(): JSX.Element | null {
  return (
    <div>
      <IssuedTokensList />
      <ButtonAddNew onClick={() => {}} text="Create digital asset" />
    </div>
  );
}
