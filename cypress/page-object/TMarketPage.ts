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

  getDialogHeaderName(): string {
    return ".ant-modal-content header h1";
  }

  getDialogStepActiveNumber(): string {
    return ".ant-steps-item-active .ant-steps-item-icon span";
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
    return '[name="assetA"]';
  }

  getFieldNumberFromAssetB(): string {
    return '[name="assetB"]';
  }
}
