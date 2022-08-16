Feature: Withdraw rewards as delegate to another address
  Background:
    * I connect Web Demo wallet
    * Set "fourthMnemonic" wallet with Engagement Points and Engagement Rewards
    * Open wallet dialog from main menu
    * I see my TGD balance in wallet "fourthMnemonic"
    * I close wallet dialog modal
    * I visit Engagement page

  Scenario: Delegate withdraws rewards to another address

    # Set delegate account
    * I type address from "randomMnemonicThird" in Delegated withdrawal to field
    * I click the "Set delegate" button
    * I see Tx success screen with address from "randomMnemonicThird"
    * I click Go to Engagement button
    * I see Delegate field is pre-field with address from "randomMnemonicThird"

    # Check initial Address field
    * I see the "Address" field prefilled with my "fourthAccount" wallet
    * I see my Engagement Points "4 / 2034 (0.20%)" and Engagement Rewards "8" TGD

    # Fill "Receiver address" field
    * I enter address in the "Receiver address" field from "randomMnemonicFourth" wallet

    # Withdraw rewards
    * I use "randomMnemonicFourth" to make a query and check balance of this address "0"
    * I click on the "Withdraw rewards" button
    * I see Tx success screen with address from "randomMnemonicFourth"
    * I click Go to Engagement button
    * I use "randomMnemonicFourth" to make a query and check balance of this address "8"

    # Replace delegated address with initial account
    * I see Delegate field is pre-field with address from "randomMnemonicThird"
    * I click on the Clear delegate button
    * I see Tx success screen with existing "fourthAccount" address
    * I click Go to Engagement button
    * I see Delegate field is pre-field with address "fourthAccount"

    # I can no longer withdraw rewards for the initial account
    * I see the "Address" field prefilled with my "fourthAccount" wallet
    * I see my Engagement Points "4 / 2034 (0.20%)" and Engagement Rewards "0" TGD
    * I see no any address in the "Receiver address" field
