import { And, Given } from "cypress-cucumber-preprocessor/steps";

Given("I visit Validators", () => {
  cy.wait(8000); //workaround until fetching validators
  cy.contains("delme").click();
});

And("I am a validator", () => {
  localStorage.setItem(
    "burner-wallet",
    "merit daring radio hospital exchange kitten skirt cry seven evil faculty lion cup inherit live host stable tuna convince tip blur sphere curve search",
  );
  cy.reload().visit("/validators");
});

And("I find my name and address on the list of validators and click on it", () => {
  cy.get('[data-cy="address-hash"]').should("contain.text", "tgrade12ty7w05kswvuvvzzdxdv8w4tf7g6y9xexy5rzj");
  //TODO
});

And("I see my name, address, slashing events, and voting power on the Validator Detail modal", () => {
  //TODO
});
