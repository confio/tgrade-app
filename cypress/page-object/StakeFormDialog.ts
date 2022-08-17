export class StakeFormDialog {
  getLiquidAmountField(): string {
    return '[name="form-item-name-liquid-amount-to-stake"]';
  }

  getVestingAmountField(): string {
    return '[name="form-item-name-vesting-amount-to-stake"]';
  }

  getPotentialVotingPower(): string {
    return '[name="form-item-name-potential-voting-power"]';
  }

  getStakeTokensButton(): string {
    return '[data-cy="stake-form-dialog-potential-voting-power"]';
  }
  getTxSuccessScreen(): string {
    return '[data-cy="transaction-result-screen-text"]';
  }
}
