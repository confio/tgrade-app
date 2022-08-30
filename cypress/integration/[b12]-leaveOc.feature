Feature: Leave the Oversight Community
  Background:
    * I connect Web Demo wallet
    * Set existing "adminAccount" wallet with Engagement Points and Engagement Rewards
    * I open Governance menu
    * I visit Oversight Community page
    * I see "Your escrow" because I am member of OC

  Scenario: Send TTA
    * I click on the gear icon and on Leave Oversight Community
    * I click on Leave button in Leave OC modal
    * I see Tx success screen
    * I click on Go to Oversight Community details button
    * I see "No escrow required" because I am not a member anymore
