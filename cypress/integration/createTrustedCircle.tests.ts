describe("Trusted Circle", () => {
  beforeEach(() => {
    cy.visit("/trustedcircle");
  });

  describe("create trusted circle", () => {
    beforeEach(() => {
      cy.findByText(/Add Trusted Circle/i).click();
      cy.findByText(/Create Trusted Circle/i).click();
      cy.findByPlaceholderText(/Enter Trusted Circle name/i).type("Trusted Circle Test #1");
      cy.findByRole("button", { name: /Next/i }).click();
      cy.findByRole("button", { name: /Next/i }).click();
      cy.findByRole("button", { name: /Connect wallet/i }).click();
      cy.wait(1500); //should be improved
      cy.contains("Web wallet (demo)").click();
      cy.wait(1500); //should be improved
      cy.findByRole("button", { name: /Sign transaction and pay escrow/i })
        .click()
        .should("not.exist");
      cy.findByRole("button", { name: /Go to Trusted Circle details/i }).click();
    });
    it("show that trusted circle is created", () => {
      cy.contains("Trusted Circle Test #1").should("be.visible");
    });
  });

  describe("add non-voting participant", () => {
    it("non-voting is created", () => {
      //TODO
    });
  });

  describe("non-voting participant", () => {
    it("can trade whitelisted token pair", () => {
      //TODO
    });
  });

  describe("remove non-voting participant", () => {
    it("should remove non-voting participant", () => {
      //TODO
    });
  });

  describe("non-voting participant trades whitelisted token pair ", () => {
    it("show an unauthorised message and trade fails ", () => {
      //TODO
    });
  });
});

export {};
