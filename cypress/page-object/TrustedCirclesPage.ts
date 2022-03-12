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

  getDialogStepNumber(): string {
    return ".ant-steps-item-active .ant-steps-item-icon span";
  }

  getTCNameFromActiveTab(): string {
    return "h1.ant-typography";
  }

  getPaginationThreeDots(): string {
    return "ant-tabs-nav-operations";
  }

  getPaginationDropDown(): string {
    return "ant-tabs-dropdown-open";
  }
}
