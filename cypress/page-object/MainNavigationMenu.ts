export class MainNavigationMenu {
  getConnectedWalletButton(): string {
    return 'img[alt="Demo wallet icon"]';
  }

  getEngagementMenuOption(): string {
    return '[data-cy="main-nav-side-bar-engagement"]';
  }

  getTMarketMenuOption(): string {
    return '[data-cy="main-nav-side-bar-tmarket"]';
  }

  getGovernanceMenuOption(): string {
    return '[data-cy="main-nav-side-bar-governance"]';
  }

  getOversightCommunitySubMenuOption(): string {
    return '[data-cy="main-nav-side-bar-oversight-community-sub-menu"]';
  }

  getValidatorsSubMenuOption(): string {
    return '[data-cy="main-nav-side-bar-validators-sub-menu"]';
  }

  getConnectWalletIcon(): string {
    return '[data-cy="main-menu-connect-wallet-icon"]';
  }
}
