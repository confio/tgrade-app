Feature: Check validator's data
  Background: Go to Validators page
    * I connect Web Demo wallet
    * Set validator with "node1Mnemonic" mnemonic
    * I navigate to Validators page by url

  Scenario: Check validator name, address, slashing events, voting power
    * I verify presence of validator name "delme" and address "tgrade…xy5rzj"
    * I click on Validator name "delme" to open Validator detail modal
    * I see validator's name "delme", address "tgrade12ty7w05kswvuvvzzdxdv8w4tf7g6y9xexy5rzj"
    * I see slashing events "????", and voting power "0.000 %"
