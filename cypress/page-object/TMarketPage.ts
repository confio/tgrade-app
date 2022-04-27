export class TMarketPage {
  getDropDownSelectTokenFromButton(): string {
    return 'form > div:nth-child(1) button [alt="Down arrow select token"]';
  }

  getDropDownSelectTokenToButton(): string {
    return '[alt="Down arrow select token"]';
  }

  getCloseModalDialogButton(): string {
    return '.ant-modal-content [alt="Close button"]';
  }

  getListOfCreatedTokens(): string {
    return "ul.ant-list-items";
  }

  getModalDialogContent(): string {
    return ".ant-modal-content";
  }

  getYourTransactionWasApprovedContent(): string {
    return "div.ant-modal-wrap.ant-modal-centered .ant-modal-content";
  }

  getTokenOnPinnedTabByName(tokenName: string): string {
    return `[data-testid="pinned-tokens-tab"] [aria-label="${tokenName}"]`;
  }

  getListOfTokens(): string {
    return "ul.ant-list-items";
  }

  getFieldNumberFromAssetA(): string {
    // Maybe it should have generic name as [name="From"]
    return '[name="assetA"]';
  }

  getFromFieldNumber(): string {
    return '[name="From"]';
  }

  getToFieldNumber(): string {
    return '[name="To"]';
  }

  getFieldNumberFromAssetB(): string {
    // Maybe it should have generic name as [name="To"]
    return '[name="assetB"]';
  }

  getOkButton(): string {
    // Should be improved by adding uniq id, name, role ...
    return ".ant-modal-body > .ant-col > .ant-btn";
  }
}
