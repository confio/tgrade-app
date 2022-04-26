export class TrustedCirclesPage {
  getCookiesAcceptButton(): string {
    return "#cky-btn-accept";
  }

  getMainWalletAddress(): string {
    return '[href*="/trustedcircle"] .ant-tag';
  }

  getDialogHeaderName(): string {
    return ".ant-modal-content header h1";
  }

  getDialogStepActiveNumber(): string {
    return ".ant-steps-item-active .ant-steps-item-icon span";
  }

  getProposalOptionDropDown(): string {
    return ".ant-modal-body .ant-select-selector";
  }

  getFirstItemFromDropDown(): string {
    return ".ant-select-item-option-content";
  }

  getTCNameFromActiveTab(): string {
    return "h1.ant-typography";
  }

  getHiddenPaginationThreeDots(): string {
    return ".ant-tabs-nav-operations-hidden";
  }

  getPaginationDropDown(): string {
    return "button.ant-tabs-nav-more";
  }

  getFirstTCbyOrderNumberInListBox(numberInList: number): string {
    return `[role="listbox"] li:nth-child(${numberInList})`;
  }

  getCurrentTrustedCircleAddress(): string {
    return ".address-actions-container";
  }
}
