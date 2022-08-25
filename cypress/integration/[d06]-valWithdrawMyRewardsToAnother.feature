Feature: Withdraw my rewards to another address
  Background:
    * I connect Web Demo wallet
    * Set validator with "node1Mnemonic" mnemonic
    * Open wallet dialog from main menu
    * I see TGD balance "1000" for random address
    * I close wallet dialog modal
    * I open Governance menu
    * I visit Validators page
    * I click "node1Account" address on the list of validators
    * I see validator's address "node1Account" with related account "node1Account" name
    * I see Distributed points "0" value and Distributed rewards "0" in validators details dialog


  Scenario: Withdraw rewards to another

    # Open Distributed rewards
    * I click on the "Claim rewards" button
    * I see Distributed Points "0" and Distributed Rewards '0' TGD
    * I see initial "Address" field is pre-filled with "node1Account" in the dialog

    # Enter Receiver address and Withdraw rewards
    * I enter address "node1Account" to "Receiver address" field
    #* I click on the "Withdraw rewards" button in the dialog
    #* I see Tx success screen with existing "node1Account" address
    #* I click Go to Engagement button

    # Check balance of initial account
    #TODO

    # Check balance of Receiver address
    #* I check that the other account's TGD balance has gone up
