export class EngagementPage {
  getQueryAddressInputField(): string {
    return '[name="form-item-name-address"]';
  }

  getAddressTooltipTagHash(): string {
    return '[data-cy="address-copy-tooltip-tag-hash"]';
  }

  getVotingPowerValue(): string {
    return '[data-cy="validator-detail-dialog-voting-power"]';
  }
}
