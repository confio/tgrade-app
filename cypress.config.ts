import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // We've imported your old e2e plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./e2e/plugins/index.js")(on, config);
    },
    baseUrl: "http://localhost:3000",
    specPattern: "./e2e/features/*.feature",
    excludeSpecPattern: "**/*.{js,ts}",
    supportFile: false,
    video: true,
    screenshotOnRunFailure: true,
    watchForFileChanges: false,
  },
});
