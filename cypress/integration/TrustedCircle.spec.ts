///<reference types="cypress"/>

describe('Trusted Circle', () => {
  beforeEach(() => {
    cy.visit('/trustedcircle')
  })

  describe('create trusted circle', () => {
    beforeEach(() => {
      cy.findByText(/Add Trusted Circle/i).click()
      cy.findByText(/Create Trusted Circle/i).click()
      cy.findByPlaceholderText(/Enter Trusted Circle name/i).type('Trusted Circle Test #1')
      cy.findByRole('button', {name: /Next/i}).click()
      cy.findByRole('button', {name: /Next/i}).click()
      cy.findByRole('button', {name: /Connect wallet/i}).click()
      cy.wait(2000)
      cy.contains("Web wallet (demo)").click()
      cy.wait(2000)
      cy.findByRole('button', {name: /Sign transaction and pay escrow/i}).click()
    })
    it('should show message "your transaction was approved!"', () => {
      cy.findByText('You are the voting participant in Trusted Circle Test #1').should('be.visible')
      cy.findByRole('button', {name: /Go to Trusted Circle details/i}).click()
    })
  })
})
