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
    * I enter address from "randomMnemonic03" in Delegated withdrawal to field
    * I click the "Set delegate" button
    * I see Tx success screen with address from "randomMnemonic03"
    * I click Go to Engagement button
    * I see Delegate field is pre-field with address from "randomMnemonic03"

    # Switch to delegated account
    * Workaround to clear localstorage
    * I connect Web Demo wallet
    * Set "randomMnemonic03" wallet without Engagement Points and Engagement Rewards
    * I visit Engagement page
    * I see Delegate field is pre-field with address from "randomMnemonic03"

    # Check Engagement of Initial address
    * I enter existing "fifthAccount" address to initial Address field
    * I see the "Address" field prefilled with my "fifthAccount" wallet
    * I see Engagement Points "6 / 2034 (0.29%)" and Engagement Rewards "12" TGD

    # Fill "Receiver address" field
    * I enter address in the "Receiver address" field from "randomMnemonic04" wallet

    # Withdraw rewards
    * I use "randomMnemonic04" to make query and check balance of this address "0"
    * I click on the "Withdraw rewards" button
    * I see Tx success screen with address from "randomMnemonic04"
    * I click Go to Engagement button
    * I use "randomMnemonic04" to make query and check balance of this address "12"

    # I switch back to Initial account
    * Workaround to clear localstorage
    * I connect Web Demo wallet
    * Set existing "fifthMnemonic" wallet with Engagement Points and Engagement Rewards
    * I visit Engagement page
    * I see Delegate field is pre-field with address from "randomMnemonic03"

    # Clear delegated address under initial account
    * I click on the Clear delegate button
    * I see Tx success screen with existing "fifthAccount" address
    * I click Go to Engagement button
    * I see Delegate field is pre-field with address "fifthAccount"

    # I switch to delegated account
    * Workaround to clear localstorage
    * I connect Web Demo wallet
    * Set "randomMnemonic03" wallet without Engagement Points and Engagement Rewards
    * I visit Engagement page
    * I see Delegate field is pre-field with address from "randomMnemonic03"

    # Check Engagement of Initial address
    * I enter existing "fifthAccount" address to initial Address field
    * I see the "Address" field prefilled with my "fifthAccount" wallet
    * I see Engagement Points "6 / 2034 (0.29%)" and Engagement Rewards "0" TGD
