export class OcClaimBackYourEscrowModal {
  getRequiredEscrowValue(): string {
    return '[data-cy="oc-claim-back-modal-required-escrow-value"]';
  }

  getYourCurrentEscrowValue(): string {
    return '[data-cy="oc-claim-back-modal-your-current-escrow-value"]';
  }

  getEscrowYouCanClaim(): string {
    return '[data-cy="oc-claim-back-modal-you-can-claim-escrow-value"]';
  }

  getClaimEscrowButton(): string {
    return '[data-cy="oc-claim-back-modal-next-action-button"]';
  }
}
