import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { en, es, ru } from "./locales";

i18n.use(initReactI18next).init({
  supportedLngs: ["en", "es", "ru"],
  resources: { en, es, ru } as const,
  fallbackLng: "en",
  lng: "en",
  ns: ["common", "login", "wallet", "cw20Wallet", "staking"],
});

export { i18n };
