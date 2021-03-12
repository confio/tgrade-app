import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en, es } from "./locales";

i18n.use(initReactI18next).init({
  supportedLngs: ["en", "es"],
  resources: { en, es } as const,
  fallbackLng: "en",
  lng: "en",
  ns: ["common", "login", "wallet", "cw20Wallet", "staking"],
});

export { i18n };
