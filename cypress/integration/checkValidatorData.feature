Feature: Check validator's data
  Background: Go to Validators page
    * I visit Validators page
    * I connect to Web Demo wallet
    * I set validator mnemonic

  Scenario: Check validator name, address, slashing events, voting power
    * I verify presence of validator name "delme" and address "tgrade…xy5rzj"
    * I click on Validator name "delme" to open Validator detail modal
    * I see validator's name "delme", address "tgrade12ty7w05kswvuvvzzdxdv8w4tf7g6y9xexy5rzj"
    * I see slashing events "????", and voting power "0.000 %"
