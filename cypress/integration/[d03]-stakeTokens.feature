@validator
Feature: Stake tokens
  Background:
    * I connect Web Demo wallet
    * Set validator with "node0Mnemonic" mnemonic
    * I open Governance menu
    * I visit Validators page

  Scenario: Stake
    * I click on "node0Account" address on the list of validators
    * I see validator's address "node0Account" with related account "node0Account" name
    * I click on the "Stake" button

    # Add liquid and vesting amount
    * I enter "4" liquid amount and "3" vesting amount
    * I see potential voting power has been changed to "100.00%"
    * I click on the "Stake tokens" button
    * I see Tx success screen
    * I click Go to Validator details page
    * I see voting power "100.00%" on Validator details dialog
    * I close validator details dialog
    * I see voting power "100.00%" for "node0Account" validator in Validator overview table
