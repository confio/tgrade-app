Feature: Withdraw my rewards to another address
  Background:
    * I connect Web Demo wallet
    * Set validator with "node0Mnemonic" mnemonic
    * Open wallet dialog from main menu
    * I see "1000" balance for "TGD" token
    * I close wallet dialog modal
    * I open Governance menu
    * I visit Validators page
    * I click on "node0Account" address on the list of validators
    * I see validator's address "node0Account" with related account "node0Account" name
    * I see Distributed points "18000" value and Distributed rewards "0.02" in validators details dialog

  Scenario: Withdraw rewards to another

    # Open Distributed rewards
    * I click on the "Claim rewards" button
    * I see Distributed Points "1800" and Distributed Rewards '0.2' TGD in Distributed rewards dialog
    * I see initial "Address" field is pre-filled with "node0Account" in the dialog

    # Enter Receiver address and Withdraw rewards
    * I enter address in the "Receiver address" field from "randomMnemonic02" wallet in Distributed rewards dialog
    * I use "randomMnemonic02" to make query and check balance of this address "0"
    * I click on the "Withdraw rewards" button in Distributed rewards dialog
    * I see Tx success screen with address from "randomMnemonic02"
    * I click on Go to Validator details button

    # Check balance of initial account
    * I see Distributed points "18000" value and Distributed rewards "0.01" in validators details dialog
    * I close validator details dialog
    * Open wallet dialog from main menu

    # Check balance of Receiver address
    * I use "randomMnemonic02" to make query and check balance of this address "192"
