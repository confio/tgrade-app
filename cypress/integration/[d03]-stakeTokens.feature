Feature: Stake tokens
  Background:
    * I connect Web Demo wallet
    * Set validator with "node0Mnemonic" mnemonic
    * I open Governance menu
    * I visit Validators page

  Scenario: Stake
    * I click "node0Account" address on the list of validators
    * I see validator's address "node0Account" with related account "node0Account" name
    * I click on the "Stake" button

    # Add liquid and vesting amount
    * I enter "4" liquid amount and "3" vesting amount

    # TODO voting power does not changed!
    * I see how the input has changed my potential voting power "100.000%"
    * I click on the "Stake tokens" button
    * I see Tx success screen

    # TODO add further steps with assertions
