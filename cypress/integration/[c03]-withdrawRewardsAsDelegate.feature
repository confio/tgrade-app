Feature: Withdraw rewards as delegate
  Background:
    * I connect Web Demo wallet
    * Set "thirdMnemonic" wallet with Engagement Points and Engagement Rewards
    * Open wallet dialog from main menu
    * I see my TGD balance in wallet "thirdMnemonic"
    * I close wallet dialog modal
    * I visit Engagement page

  Scenario: Delegate withdraws rewards

    # Set delegate account
    * I type address from "randomMnemonicSecond" in Delegated withdrawal to field
    * I click the "Set delegate" button
    * I see Tx success screen with address from "randomMnemonicSecond"
    * I click Go to Engagement button

    # Check balance of delegated account
    * I see Delegate field is pre-field with address from "randomMnemonicSecond"
    * I use "randomMnemonicSecond" to make query and check balance of this address "0"

    # Check balance of initial account
    * I see the "Address" field prefilled with my "thirdAccount" wallet
    * I see my Engagement Points "3 / 2034 (0.15%)" and Engagement Rewards "6" TGD
    * I see no any address in the "Receiver address" field

    # Withdraw rewards
    * I click on the "Withdraw rewards" button
    #* I see Tx success screen with existing "fifthAccount" address //tgrade-app/issues/798
    * I click Go to Engagement button

    # Check balance of Delegated address
    * I see my Engagement Points "3 / 2034 (0.15%)" and Engagement Rewards "0" TGD
    #* I use existing "fifthMnemonic" mnemonic of receive address to query balance "18"
    #* I check that the delegate account's TGD balance has gone up
    #* I check balance on new receive address "9" //tgrade-app/issues/798

    # Replace delegated address with initial account
    * I see Delegate field is pre-field with address from "randomMnemonicSecond"
    * I click on the Clear delegate button
    * I see Tx success screen with existing "thirdAccount" address
    * I click Go to Engagement button
    * I see Delegate field is pre-field with address "thirdAccount"

    # Check balance of initial address after
    * I see the "Address" field prefilled with my "thirdAccount" wallet
    * I see my Engagement Points "3 / 2034 (0.15%)" and Engagement Rewards "0" TGD
