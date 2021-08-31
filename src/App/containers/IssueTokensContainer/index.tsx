import ButtonAddNew from "App/components/ButtonAddNew";
import IssuedTokensList from "App/components/IssuedTokensList";
import { useState } from "react";
import IssueTokenModal from "../IssueTokenModal";
import { ItemWrapper } from "./style";
import { getTokensList } from "App/pages/TMarket/utils";
import { TokenProps } from "utils/tokens";
import { useTMarket } from "service/tmarket";

export default function IssueTokensContainer(): JSX.Element | null {
  const [isModalOpen, setModalOpen] = useState(false);
  const { tMarketState } = useTMarket();
  const tokens: TokenProps[] = getTokensList(tMarketState.tokens, "");
  console.log(tokens);
  return (
    <div>
      <h2 style={{ margin: "5px", fontSize: "20px" }}>Issued Tokens</h2>
      <IssuedTokensList tokens={tokens} />
      <ItemWrapper>
        <ButtonAddNew onClick={() => setModalOpen(true)} text="Create digital asset" />
      </ItemWrapper>
      <IssueTokenModal isModalOpen={isModalOpen} closeModal={() => setModalOpen(false)} />
    </div>
  );
}
