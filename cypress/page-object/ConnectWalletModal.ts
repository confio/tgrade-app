export class ConnectWalletModal {
  getTokenBalance(): string {
    return '[data-cy="connect-wallet-modal-token-balance"]';
  }

  getCloseIcon(): string {
    return '[data-cy="connect-wallet-modal-close-icon"]';
  }

  getTokenNameFromTheList(tokenName: string): string {
    return `[data-cy="wallet-dialog-list-of-tokens-with-${tokenName}`;
  }

  getDisplayedTokenBalance(): string {
    return '[data-cy="wallet-dialog-send-token-modal-balance-value"]';
  }

  getTokenName(): string {
    return '[data-cy="wallet-dialog-send-token-modal-token-name"]';
  }

  getAmountToSendField(): string {
    return '[name="form-item-name-amount-to-send"]';
  }

  getRecipientAddressField(): string {
    return '[name="form-item-name-recipient-address"]';
  }

  getSendButton(): string {
    return '[data-cy="wallet-dialog-send-token-modal-send-token-button"]';
  }

  getGoToWalletButton(): string {
    return '[data-cy="wallet-dialog-send-token-modal-go-to-wallet-button"]';
  }
}
