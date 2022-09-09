export class ConnectWalletModal {
  getTokenBalance(): string {
    return '[data-cy="connect-wallet-modal-token-balance"]';
  }

  getCloseIcon(): string {
    return '[data-cy="connect-wallet-modal-close-icon"]';
  }

  getTokenNameFromTheList(tokenName: string): string {
    return `[data-cy="wallet-dialog-list-of-tokens-with-${tokenName}"]`;
  }

  getDisplayedTokenBalance(): string {
    return '[data-cy="wallet-dialog-send-token-modal-balance-value"]';
  }

  getConnectWalletModal(): string {
    return '[data-cy="connect-wallet-modal"]';
  }

  getSearchTokenField(): string {
    return '[data-cy="available-token-search-field"]';
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

  getWalletAddress(): string {
    return '[data-cy="address-copy-tooltip-tag-hash"]';
  }

  getLoaderSpinnerIcon(): string {
    return '[data-cy="loader-spinner-icon"]';
  }

  getNoBalanceFoundForPinnedTokensText(): string {
    return '[data-cy="connect-wallet-modal-no-pinned-tokens-found-text"]';
  }
}
