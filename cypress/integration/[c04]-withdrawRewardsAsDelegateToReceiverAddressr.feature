Feature: Withdraw rewards as delegate to another address
  Background:
    * I connect Web Demo wallet
    * Set existing "fifthMnemonic" wallet with Engagement Points and Engagement Rewards
    * Open wallet dialog from main menu
    * I see my TGD balance in wallet "fifthMnemonic"
    * I close wallet dialog modal
    * I visit Engagement page

  Scenario: Delegate withdraws rewards to another address

    # Set delegate account
    * I type address from "randomMnemonicThird" in Delegated withdrawal to field
    * I click the "Set delegate" button
    * I see Tx success screen with address from "randomMnemonicThird"
    * I click Go to Engagement button
    * I see Delegate field is pre-field with address from "randomMnemonicThird"

    # I switch to delegated account
    * Workaround to clear localstorage
    * I connect Web Demo wallet
    * Set "randomMnemonicThird" wallet without Engagement Points and Engagement Rewards
    * I visit Engagement page
    * I see Delegate field is pre-field with address from "randomMnemonicThird"

    # Check initial Address field
    * I enter existing "fifthAccount" address to initial Address field
    * I see the "Address" field prefilled with my "fifthAccount" wallet
    * I see my Engagement Points "6 / 2034 (0.29%)" and Engagement Rewards "12" TGD

    # Fill "Receiver address" field
    * I enter address in the "Receiver address" field from "randomMnemonicFourth" wallet

    # Withdraw rewards
    * I use "randomMnemonicFourth" to make query and check balance of this address "0"
    * I click on the "Withdraw rewards" button
    * I see Tx success screen with address from "randomMnemonicFourth"
    * I click Go to Engagement button
    * I use "randomMnemonicFourth" to make query and check balance of this address "12"

    # I switch back to initial account
    * Workaround to clear localstorage
    * I connect Web Demo wallet
    * Set existing "fifthMnemonic" wallet with Engagement Points and Engagement Rewards
    * I visit Engagement page
    * I see Delegate field is pre-field with address from "randomMnemonicThird"

    # Clear delegated address under initial account
    * I click on the Clear delegate button
    * I see Tx success screen with existing "fifthAccount" address
    * I click Go to Engagement button
    * I see Delegate field is pre-field with address "fifthAccount"

    # I switch to delegated account
    * Workaround to clear localstorage
    * I connect Web Demo wallet
    * Set "randomMnemonicThird" wallet without Engagement Points and Engagement Rewards
    * I visit Engagement page
    * I see Delegate field is pre-field with address from "randomMnemonicThird"

    # Check initial Address field
    * I enter existing "fifthAccount" address to initial Address field
    * I see the "Address" field prefilled with my "fifthAccount" wallet
    * I see my Engagement Points "6 / 2034 (0.29%)" and Engagement Rewards "0" TGD
