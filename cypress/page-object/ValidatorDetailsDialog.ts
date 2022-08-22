export class ValidatorDetailsDialog {
  getValidatorName(): string {
    return '[data-cy="details-dialog-validator-name"]';
  }

  getAddressTooltipTagHash(): string {
    return '[data-cy="address-copy-tooltip-tag-hash"]';
  }

  getVotingPowerValue(): string {
    return '[data-cy="validator-detail-dialog-voting-power"]';
  }

  getStakeButton(): string {
    return '[data-cy="validator-details-stake-button"]';
  }

  getUnStakeButton(): string {
    return '[data-cy="validator-details-unstake-button"]';
  }

  getCloseDialogButton(): string {
    return '[data-cy="validator-dialog-close-button"]';
  }

  getClaimRewardsButton(): string {
    return '[data-cy="validator-details-claim-rewards-button"]';
  }
}
