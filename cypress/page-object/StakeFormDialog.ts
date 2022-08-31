export class StakeFormDialog {
  getLiquidAmountField(): string {
    return '[name="form-item-name-liquid-amount-to-stake"]';
  }

  getVestingAmountField(): string {
    return '[name="form-item-name-vesting-amount-to-stake"]';
  }

  getPotentialVotingPowerFromInputField(): string {
    return '[name="form-item-name-potential-voting-power"]';
  }

  getPotentialVotingPowerFromText(): string {
    return '[data-cy="stake-form-potential-voting-power-text"]';
  }

  getStakeTokensButton(): string {
    return '[data-cy="stake-form-potential-voting-power-stake-token-button"]';
  }

  getGoBackToValidatorDetailsButton(): string {
    return '[data-cy="validator-page-go-back-to-validator-details-button"]';
  }
}
