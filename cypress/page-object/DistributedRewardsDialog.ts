export class DistributedRewardsDialog {
  getWithdrawRewardsButton(): string {
    return '[data-cy="validator-distributed-rewards-dialog-withdraw-rewards-button"]';
  }

  getDistributedPointsValue(): string {
    return '[data-cy="validators-distributed-points-value"]';
  }

  getDistributedRewardsValue(): string {
    return '[data-cy="validators-distributed-rewards-dialog-rewards-value"]';
  }

  getGoToValidatorDetailsButton(): string {
    return '[data-cy="validators-page-tx-dialog-go-to-validator-details-button"]';
  }

  getInitialValidatorAddressField(): string {
    return '[name="form-item-name-address"]';
  }

  getReceiverAddressField(): string {
    return '[name="form-item-name-receiver-address"]';
  }
}
