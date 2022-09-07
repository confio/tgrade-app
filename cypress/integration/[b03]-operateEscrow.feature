Feature: Get voting rights after depositing escrow and claim back exceeding
  Background:
    * Execute proposal in OC with "randomMnemonic08" member
    * I connect Web Demo wallet
    * Set "randomMnemonic08" wallet without Engagement Points and Engagement Rewards
    * I open Governance menu
    * I visit Oversight Community page
    * I see "Your escrow" because I am member of OC

  Scenario: Get voting rights with exact escrow
    # Gain voting rights
    * I don't see Add proposal button available
    * I click on Deposit escrow button
    * I see how much escrow "1" I need to deposit in the Deposit escrow modal
    * I enter "2" escrow to Escrow amount field
    * I click Pay escrow button
    * I see Tx success screen with "2utgd" amount of Deposit escrow
    * I click on Go to Oversight Community details button in Escrow modal
    * I see Add proposal button is available

    # Claim back exceeding
    #* I see a "Claim escrow" button and click on it
    #* I see the "Claim back escrow" modal with required, deposited, and exceeding escrow
    #* I click on the "Claim escrow" button
    #* I see Tx success screen and close it
    #* I check that I still have voting rights
