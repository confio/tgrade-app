Feature: Withdraw rewards as delegate to another address
  Background:
    * I connect Web Demo wallet
    * Set validator with "node0Mnemonic" mnemonic
    * Open wallet dialog from main menu
    * I see TGD balance "1000" for random address
    * I close wallet dialog modal
    * I open Governance menu
    * I visit Validators page

    # Open Validator account overview dialog
    * I click on "node0Account" address on the list of validators
    * I see validator's address "node0Account" with related account "node0Account" name

    # Open Distributed rewards dialog
    * I click on the "Claim rewards" button

    # Check account balance
    * I see Distributed Points "1800" and Distributed Rewards '0.2' TGD in Distributed rewards dialog
    * I see initial "Address" field is pre-filled with "node0Account" in the dialog

  Scenario: Delegate withdraws rewards to another address

    # Set delegate
    * I enter address from "randomMnemonic06" in Delegated withdrawal to field in Distributed rewards dialog
    * I click the "Set delegate" button in Distributed rewards dialog
    * I see Tx success screen with address from "randomMnemonic06"
    * I click on Go to Validator details button

    # Open Distributed rewards dialog
    * I click on the "Claim rewards" button
    * I see Delegate field is pre-field with address from "randomMnemonic06" in Distributed rewards dialog


    # Withdraw rewards
    * I change to the delegate account
    * I visit Distributed
    * I enter the initial account's address on the "Address" field
    * I see the initial account's Distributed Points and Distributed Rewards
    * I enter the address of the other account on the "Receiver address" field
    * I click on the "Withdraw rewards" button
    * I see Tx success screen and close it
    * I check that the random account's TGD balance has gone up
    # Clear delegate
    * I change to the initial account
    * I visit Distributed
    * I see the delegate account's address prefilled on the "Delegated withdrawal to" field
    * I click on the "Clear delegate" button
    * I see Tx success screen and close it
    * I change to the previously delegate account
    * I visit Distributed
    * I enter the initial account's address on the "Address" field
    * I see the initial account's Distributed Points and Distributed Rewards
    * I see I can no longer withdraw rewards for the initial account
