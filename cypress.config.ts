import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.*",
    excludeSpecPattern: "**/page-object/*,**/steps-definition/*",
  },
});
