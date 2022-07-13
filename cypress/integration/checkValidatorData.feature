Feature: Check validator's data
  Background: Go to Validators page
    * I visit Trusted Circle page
    * I connect to Web Demo wallet
    * I set validator mnemonic
    * I visit Validators page

  Scenario: Check validator name, address, slashing events, voting power
    * I verify presence of validator name "delme" and address "tgrade…xy5rzj"
    * I click on Validator name "delme" to open Validator detail modal
    * I see validator's name "delme", address "tgrade1"
    * I see slashing events "????", and voting power "0.000 %"
