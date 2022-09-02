Feature: Withdraw rewards as delegate to another address
  Background:
    * I connect Web Demo wallet
    * Set validator with "node0Mnemonic" mnemonic
    * Open wallet dialog from main menu
    * I see TGD balance for "1000" address
    * I use existing "node0Mnemonic" mnemonic to make query and check balance "100"
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

    # Switch to delegated account
    * Workaround to clear localstorage
    * I connect Web Demo wallet
    * Set "randomMnemonic06" wallet without Engagement Points and Engagement Rewards

    # Withdraw rewards
    * I open Governance menu
    * I visit Validators page
    * I click on "node0Account" address on the list of validators
    * I see validator's address "node0Account" with related account "node0Account" name

    * I click on the "Claim rewards" button
    * I enter existing "node0Account" address to initial Address field in Distributed rewards dialog
    * I see Distributed Points "1800" and Distributed Rewards '0.2' TGD in Distributed rewards dialog

    # Enter "Receiver address" account
    * I enter address in the "Receiver address" field from "randomMnemonic07" wallet in Distributed rewards dialog
    * I use "randomMnemonic07" to make query and check balance of this address "000"

    # click Withdraw
    * I click on the "Withdraw rewards" button in Distributed rewards dialog
    * I see Tx success screen with address from "randomMnemonic07"
    * I click on Go to Validator details button
    * I close validator details dialog

    # check balance of
    * Open wallet dialog from main menu
    * I see TGD balance for "9" address
    * I close wallet dialog modal
    * I use existing "node0Mnemonic" mnemonic to make query and check balance "999"

    # Clear delegate
    * Workaround to clear localstorage
    * I connect Web Demo wallet
    * Set validator with "node0Mnemonic" mnemonic
    * I open Governance menu
    * I visit Validators page
    * I click on "node0Account" address on the list of validators
    * I see Delegate field is pre-field with address from "randomMnemonic06" in Distributed rewards dialog

    * I click on the "Clear delegate" button in Distributed rewards dialog
    * I see Tx success screen with existing "node0Account" address
    * I click on Go to Validator details button
    * I click on the "Claim rewards" button

    * I see initial "Address" field is pre-filled with "node0Account" in the dialog
    * I see Distributed Points "1800" and Distributed Rewards '0.0' TGD in Distributed rewards dialog

    # I switch to Receiver address account
    * Workaround to clear localstorage
    * I connect Web Demo wallet
    * Set "randomMnemonic06" wallet without Engagement Points and Engagement Rewards


    # TODO check balance of Receiver address
