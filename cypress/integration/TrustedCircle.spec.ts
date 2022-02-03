///<reference types="cypress"/>

describe('Trusted Circle', () => {
  beforeEach(() => {
    cy.visit('/trustedcircle')
  })

  describe('create trusted circle', () => {
    beforeEach(() => {
      cy.contains('Add Trusted Circle').click()
      cy.contains('Create Trusted Circle').click()
      cy.get('[name="form-item-name-trusted-circle-name"]').type('Trusted Circle Test #1')
      cy.contains('Next').click()
      cy.get('[name="form-item-name-add-member(s)"]').type('tgrade1kalzk5cvq5yu6f5u73k7r905yw52sawckddsc3')
      cy.contains('Next').click()
      cy.contains('Connect wallet').click()
      cy.wait(2000)
      cy.contains('Web wallet (demo)').click()
      cy.wait(2000)
      cy.contains('Sign transaction and pay escrow').click()
    })
    it('should show message "your transaction was approved!"', () => {
      cy.contains('You are the voting participant in Trusted Circle Test #1').should('be.visible')
    })
  })
})
