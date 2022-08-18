export class ValidatorsOverviewPage {
  getValidatorVotingPower(validatorName: string): string {
    return `[data-cy="voting-power-for-validator-name-${validatorName}"]`;
  }
}
