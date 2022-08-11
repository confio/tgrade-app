export class EngagementPage {
  getQueryAddressInputField(): string {
    return '[name="form-item-name-address"]';
  }

  getReceiverAddressInputField(): string {
    return '[name="form-item-name-receiver-address"]';
  }

  getEngagementPointsValue(): string {
    return '[data-cy="engagement-page-engagement-points"]';
  }

  getEngagementRewardsValue(): string {
    return '[data-cy="engagement-page-engagement-rewards"]';
  }

  getWithdrawRewardsButton(): string {
    return '[data-cy="engagement-page-withdraw-rewards-button"]';
  }

  getTransactionResultScreenText(): string {
    return '[data-cy="transaction-result-screen-text"]';
  }

  getTransactionResultScreenDetails(): string {
    return '[data-cy="transaction-result-screen-details"]';
  }

  getTransactionResultScreenGoToEngagementButton(): string {
    return '[data-cy="transaction-result-screen-go-to-engagement-button"]';
  }

  getDelegatedWithdrawalToField(): string {
    return '[name="form-item-name-delegated-withdrawal-to"]';
  }

  getSetDelegateButton(): string {
    return '[data-cy="engagement-withdraws-rewards-set-delegate-button"]';
  }

  getClearDelegateButton(): string {
    return '[data-cy="engagement-withdraws-rewards-clear-delegate-button"]';
  }

  getLastHalfLifeEventDate(): string {
    return '[data-cy="engagement-last-half-life-event-date"]';
  }

  getDisabledWithdrawRewardsButton(): string {
    return '[data-cy="engagement-page-withdraw-rewards-button"]';
  }
}
