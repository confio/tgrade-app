Feature: Get voting rights after depositing escrow and claim back exceeding
  Background:
    * I connect to Web Demo wallet
    * I am an Oversight Community member that has not deposited enough escrow
    * I visit the Oversight Community

  Scenario: Get voting rights with exact escrow
    # Gain voting rights
    * I check that I don't have voting rights
    * I see a "Deposit escrow" button and click on it
    * I see how much escrow I need to deposit in the "Deposit escrow" modal
    * I input more escrow than what is needed and click "Pay escrow"
    * I see Tx success screen and close it
    * I check that I have voting rights now
    # Claim back exceeding
    * I see a "Claim escrow" button and click on it
    * I see the "Claim back escrow" modal with required, deposited, and exceeding escrow
    * I click on the "Claim escrow" button
    * I see Tx success screen and close it
    * I check that I still have voting rights
