import { OfflineDirectSigner } from "@cosmjs/proto-signing";

export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window {
    // Google analytics
    gtag: (...args: any) => void;
    // Keplr extension
    keplr?: {
      experimentalSuggestChain: (...args: any) => Promise<void>;
      enable: (...args: any) => void;
    };
    getOfflineSigner?: (...args: any) => OfflineDirectSigner;
  }
}
