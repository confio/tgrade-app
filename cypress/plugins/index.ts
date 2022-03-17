/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.ts can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  on("task", {
    log(message) {
      console.log(message);

      return null;
    },
  });
  // optional: register cypress-grep plugin code
  // https://github.com/cypress-io/cypress-grep
  require("cypress-grep/src/plugin")(config);
  // make sure to return the config object
  // as it might have been modified by the plugin
  return config;
};
