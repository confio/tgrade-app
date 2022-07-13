Feature: Check validator name, address, slashing events, voting power
  Background:
    * I visit Trusted Circle page
    * I connect to Web Demo wallet
    * I set validator mnemonic
    * I visit Validators page

  Scenario: Check my validator's data
    * I verify presence of validator name "delme" and address "tgrade…xy5rzj"
    * I click on Validator name "delme" to open Validator detail modal
    * I see validator's name "delme", address "tgrade1tsg4wldpwyehhkqx3za78ygkzatncxxup96k7h"
    * I see slashing events "????", and voting power "100.000 %"
