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
    * I see Distributed points "19114" value and Distributed rewards "46" in validators details dialog

  Scenario: Withdraw rewards
    * I click on the "Claim rewards" button
    * I see Distributed Points "19114 / 19114 (100.00%)" and Distributed Rewards '46' TGD
    * I click on Withdraw rewards button
    * I see Tx success screen with existing "node0Account" address
    * I click on Go to Validator details button
    * I see Distributed points "19114" value and Distributed rewards "0" in validators details dialog
    * I close validator details dialog
    * Open wallet dialog from main menu
    * I see TGD balance "566" for random address
