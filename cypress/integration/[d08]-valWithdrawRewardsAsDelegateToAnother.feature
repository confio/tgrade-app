Feature: Withdraw rewards as delegate to another address
  Background:
    * I connect Web Demo wallet
    * Set validator with "node0Mnemonic" mnemonic
    * Open wallet dialog from main menu
    #* I see "9" balance for "TGD" token
    #* I use existing "node0Mnemonic" mnemonic to make query and check balance "100"
    * I close wallet dialog modal
    * I open Governance menu
    * I visit Validators page

    # Open Validator account overview dialog
    * I click on "node0Account" address on the list of validators
    * I see validator's address "node0Account" with related account "node0Account" name

    # Open Distributed rewards dialog
    * I click on the "Claim rewards" button

  Scenario: Delegate withdraws rewards to another address

    # Set delegate
    * I enter address from "randomMnemonic06" in Delegated withdrawal to field in Distributed rewards dialog
    * I click the "Set delegate" button in Distributed rewards dialog
    * I see Tx success screen with address from "randomMnemonic06"
    * I click on Go to Validator details button
    * I click on the "Claim rewards" button
    * I see Delegate field is pre-field with address from "randomMnemonic06" in Distributed rewards dialog

    # Enter "Receiver address" account
    * I enter address in the "Receiver address" field from "randomMnemonic07" wallet in Distributed rewards dialog
    * I use "randomMnemonic07" to make query and check balance of this address "000"

    # Click Withdraw rewards button
    * I click on the "Withdraw rewards" button in Distributed rewards dialog
    * I see Tx success screen with address from "randomMnemonic07"
    * I click on Go to Validator details button
    * I see Distributed Points "1800" and Distributed Rewards '0.0' TGD in Distributed rewards dialog
    * I close validator details dialog

    # Check current balance of Initial account
    * Open wallet dialog from main menu
    * I see "999" balance for "TGD" token
    * I close wallet dialog modal

    # I switch to Receiver address account
    * Workaround to clear localstorage
    * I connect Web Demo wallet
    * Set "randomMnemonic07" wallet without Engagement Points and Engagement Rewards

    # Check Rewards of Receiver address account
    * Open wallet dialog from main menu
    # TODO improve after getting more validator issues/789
    * I see "0.1" balance for "TGD" token
    * I close wallet dialog modal
    # TODO improve after getting more validator issues/789
    * I use "randomMnemonic07" to make query and check balance of this address "0"

    # I switch back To Initial validator account
    # To clear delegate address
    * Workaround to clear localstorage
    * I connect Web Demo wallet
    * Set validator with "node0Mnemonic" mnemonic
    * I open Governance menu
    * I visit Validators page
    * I click on "node0Account" address on the list of validators
    * I click on the "Claim rewards" button
    * I see Delegate field is pre-field with address from "randomMnemonic06" in Distributed rewards dialog

    * I click on the "Clear delegate" button in Distributed rewards dialog
    * I see Tx success screen with existing "node0Account" address
    * I click on Go to Validator details button
    * I click on the "Claim rewards" button
    * I see Delegate field is pre-field with address "node0Account" in Distributed rewards dialog

    # Switch to Delegated account
    * Workaround to clear localstorage
    * I connect Web Demo wallet
    * Set "randomMnemonic06" wallet without Engagement Points and Engagement Rewards

    # Check balance of Delegated account
    * Open wallet dialog from main menu
    # TODO improve after getting more validator issues/789
    * I see "0" balance for "TGD" token
    * I close wallet dialog modal
    # TODO improve after getting more validator issues/789
    * I use existing "node0Mnemonic" mnemonic to make query and check balance "0"
