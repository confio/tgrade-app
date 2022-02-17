describe("Trusted Circle", () => {
  beforeEach(() => {
    cy.visit("/trustedcircle");
  });

  describe("create trusted circle", () => {
    beforeEach(() => {
      cy.findByText(/Add Trusted Circle/i).click();
      cy.findByText(/Create Trusted Circle/i).click();
      cy.findByPlaceholderText(/Enter Trusted Circle name/i)
        .type("Trusted Circle Test #4")
        .should("have.value", "Trusted Circle Test #4");
      cy.get(".ant-modal-content header h1").should("have.text", "Start Trusted Circle");
      cy.get(".ant-steps-item-active .ant-steps-item-icon span").should("have.text", "1");
      cy.findByRole("button", { name: /Next/i }).click();

      cy.get(".ant-steps-item-active .ant-steps-item-icon span").should("have.text", "2");
      cy.findByRole("button", { name: /Next/i }).click();

      cy.get(".ant-steps-item-active .ant-steps-item-icon span").should("have.text", "3");
      cy.findByRole("button", { name: /Connect wallet/i }).click();

      cy.findByText("Web wallet (demo)").click();
      cy.findByRole("button", { name: /Try again/i }).should("not.exist");

      cy.get(".ant-steps-item-active .ant-steps-item-icon span").should("have.text", "3");
      cy.wait(3500); // do not know what happens in 1,5s but if there is no wait it does not click on the button
      cy.findByRole("button", { name: /Sign transaction and pay escrow/i }).click();

      cy.findByRole("button", { name: /Go to Trusted Circle details/i }).click();
    });
    it("show that trusted circle is created", () => {
      cy.get("h1.ant-typography").should("have.text", "Trusted Circle Test #4");
    });
  });
});

export {};
