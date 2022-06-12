import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins")(on, config);
    },
    baseUrl: "http://localhost:3000",
    specPattern: "./cypress/integration/**/**/",
    supportFile: false,
    video: true,
    screenshotOnRunFailure: true,
    watchForFileChanges: false,
  },
});
