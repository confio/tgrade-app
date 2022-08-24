Feature: Withdraw my rewards to my address
  Background:
    * I connect Web Demo wallet
    * Set validator with "node0Mnemonic" mnemonic
    * Open wallet dialog from main menu
    * I see TGD balance "1003" for random address
    * I close wallet dialog modal
    * I open Governance menu
    * I visit Validators page
    * I click "node0Account" address on the list of validators
    * I see validator's address "node0Account" with related account "node0Account" name

  Scenario: Withdraw rewards
    #* I click on the "Claim rewards" button
    #* I see my Distributed Points and Distributed Rewards
    #* I click on the "Withdraw rewards" button
    #* I see Tx success screen
    #* I check that my TGD balance has gone up
