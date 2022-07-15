export class MainNavigationMenu {
  getConnectedWalletButton(): string {
    return 'img[alt="Demo wallet icon"]';
  }

  getEngagementMenuOption(): string {
    return '[data-cy="main-nav-side-bar-engagement"]';
  }

  getConnectWalletIcon(): string {
    return '[data-cy="main-menu-connect-wallet-icon"]';
  }
}
