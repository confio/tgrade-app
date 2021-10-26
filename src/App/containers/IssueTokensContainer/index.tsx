import ButtonAddNew from "App/components/ButtonAddNew";
import IssuedTokensList from "App/components/IssuedTokensList";
import { getTokensList } from "App/pages/TMarket/utils";
import { lazy, useState } from "react";
import { useTMarket } from "service/tmarket";
import { TokenProps } from "utils/tokens";

import { ItemWrapper, Title } from "./style";

const IssueTokenModal = lazy(() => import("../IssueTokenModal"));

export default function IssueTokensContainer(): JSX.Element | null {
  const [isModalOpen, setModalOpen] = useState(false);
  const { tMarketState } = useTMarket();
  const tokens: TokenProps[] = getTokensList(tMarketState.tokens, "");
  return (
    <div style={{ marginLeft: "10px" }}>
      <Title>Issued Tokens</Title>
      <IssuedTokensList tokens={tokens} />
      <ItemWrapper>
        <ButtonAddNew onClick={() => setModalOpen(true)} text="Create digital asset" />
      </ItemWrapper>
      <IssueTokenModal isModalOpen={isModalOpen} closeModal={() => setModalOpen(false)} />
    </div>
  );
}
