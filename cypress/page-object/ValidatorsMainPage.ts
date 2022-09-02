export class ValidatorsMainPage {
  getValidatorName(validatorName: string): string {
    return `[data-cy="validator-name-${validatorName}"]`;
  }

  getAllNamesFromValidatorNameColumn(): string {
    return '[data-cy="overview-page-validator-address"]';
  }
}
