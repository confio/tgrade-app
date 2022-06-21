Feature: Leave the Oversight Community
  Background:
    * I connect to Web Demo wallet
    * I am an Oversight Community member
    * I visit the Oversight Community

  Scenario: Send TTA
    * I click on the gear icon and on Leave Oversight Community
    * I see the Leave OC modal
    * I click on Leave
    * I see Tx success screen and close it
    * I see "No escrow required" because I am not a member anymore
