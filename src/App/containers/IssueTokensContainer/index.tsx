import ButtonAddNew from "App/components/ButtonAddNew";
import IssuedTokensList from "App/components/IssuedTokensList";
import { useState } from "react";
import IssueTokenModal from "../IssueTokenModal";
import { ItemWrapper } from "./style";

export default function IssueTokensContainer(): JSX.Element | null {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <h2 style={{ margin: "5px", fontSize: "20px" }}>Issued Tokens</h2>
      <IssuedTokensList />
      <ItemWrapper>
        <ButtonAddNew onClick={() => {}} text="Create digital asset" />
      </ItemWrapper>
      <IssueTokenModal isModalOpen={isModalOpen} closeModal={() => setModalOpen(false)} />
    </div>
  );
}
