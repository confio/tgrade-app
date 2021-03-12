# How to add a new locale

1. Create a directory for the new locale inside `locales`, the name of the directory should be a standard locale code, like "en" for English or "es" for Spanish.
2. Inside that directory copy all the files inside the "en" folder and translate those that end in `.json`.
3. The `index.ts` inside the new locale folder should export all `.json` files inside an object with the same name as the locale. For Russian (ru), that would be:

```typescript
import common from "./common.json";
import cw20Wallet from "./cw20Wallet.json";
import login from "./login.json";
import staking from "./staking.json";
import wallet from "./wallet.json";

export const ru = { common, login, wallet, cw20Wallet, staking };
```

4. Export the new locale from `locales/.index.ts`:

```typescript
export { en } from "./en";
export { es } from "./es";
export { ru } from "./ru"; // <-- new line for new locale
```

5. Add new locale to `supportedLngs` and `resources` in `i18n/config.ts`:

```typescript
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en, es, ru } from "./locales"; // <-- import new locale

i18n.use(initReactI18next).init({
  supportedLngs: ["en", "es", "ru"], // <-- add new supported language
  resources: { en, es, ru } as const, // <-- add new imported locale as a new resource
  fallbackLng: "en",
  lng: "en",
  ns: ["common", "login", "wallet", "cw20Wallet", "staking"],
```

6. Add new language option to side menu in `src/App/components/layout/PageLayout/component.tsx`. "value" should be the locale code:

```html
<option value="en">English</option>
<option value="es">Español</option>
<option value="ru">Русский</option>
```
