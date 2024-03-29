export class TxSuccessScreen {
  getTransactionResultScreenText(): string {
    return '[data-cy="transaction-result-screen-text"]';
  }

  getTransactionResultScreenDetails(): string {
    return '[data-cy="transaction-result-screen-details"]';
  }

  getGoToOcDetailsButton(): string {
    return '[data-cy="oversight-community-tx-success-go-to-oc-details-button"]';
  }

  getEscrowModalGoToOcDetailsButton(): string {
    return '[data-cy="oc-escrow-modal-go-to-oc-details-button"]';
  }
}
