export class OversightCommunityPage {
  getGearLeaveIcon(): string {
    return '[data-cy="oversight-community-page-gear-icon"]';
  }

  getLeaveOversightCommunityOption(): string {
    return '[data-cy="oversight-community-page-leave-option"]';
  }

  getOcModalLeaveButton(): string {
    return '[data-cy="leave-oversight-community-modal-leave-button"]';
  }

  getOversightCommunityAddress(): string {
    return '[data-cy="address-copy-tooltip-tag-hash"]';
  }

  getVotingRulesQuorumValue(): string {
    return '[data-cy="oc-voting-rules-quorum-value"]';
  }

  getVotingRulesThresholdValue(): string {
    return '[data-cy="oc-voting-rules-threshold-value"]';
  }

  getVotingRulesVotingDurationValue(): string {
    return '[data-cy="oc-voting-rules-voting-duration-value"]';
  }

  getVotingRulesVotingToEndEarlyValue(): string {
    return '[data-cy="oc-voting-rules-allow-voting-to-end-early-value"]';
  }

  getVotingRulesMinimumEscrowValue(): string {
    return '[data-cy="oc-voting-rules-мinimum-escrow-value"]';
  }

  getEngagementHalfLifeDurationValue(): string {
    return '[data-cy="oc-page-engagement-half-life-duration-value"]';
  }

  getAddProposalButton(): string {
    return "[data-cy='oc-page-add-proposal-button']";
  }

  getDepositEscrowButton(): string {
    return '[data-cy="oc-page-deposit-escrow-button"]';
  }

  getRequiredEscrowValue(): string {
    return '[data-cy="deposit-escrow-modal-required-escrow-value"]';
  }

  getEscrowAmountField(): string {
    return '[name="form-item-name-escrow-amount"]';
  }

  getPayEscrowButton(): string {
    return '[data-cy="deposit-escrow-modal-pay-escrow-button"]';
  }

  getClaimEscrowButton(): string {
    return '[data-cy="oc-page-claim-escrow-button"]';
  }
}
