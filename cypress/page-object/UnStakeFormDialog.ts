export class UnStakeFormDialog {
  getAmountToUnStakeInputField(): string {
    return '[name="form-item-name-amount-to-unstake"]';
  }

  getUnStakeTokensButton(): string {
    return '[data-cy="unstake-form-unstake-tokens-button"]';
  }
}
