export class EngagementPage {
  getQueryAddressInputField(): string {
    return '[name="form-item-name-address"]';
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
}
