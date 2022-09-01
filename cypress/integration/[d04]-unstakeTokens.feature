@job_02
Feature: Unstake tokens
  Background:
    * I connect Web Demo wallet
    * Set validator with "node0Mnemonic" mnemonic
    * I open Governance menu
    * I visit Validators page

  Scenario: Unstake
    * I click on "node0Account" address on the list of validators
    * I see validator's address "node0Account" with related account "node0Account" name
    * I click on the "Unstake" button
    * I enter "15" amount of TGD to be unstaked
    * I see potential voting power has been changed to "100.00%"
    * I click on the "Unstake tokens" button
    * I see Tx success screen
    * I click Go to Validator details page
    * I see voting power "100.00%" on Validator details dialog
    * I close validator details dialog
    * I see voting power "100.00%" for "node0Account" validator in Validator overview table
