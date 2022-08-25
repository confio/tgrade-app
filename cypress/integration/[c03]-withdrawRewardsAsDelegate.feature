Feature: Withdraw rewards as delegate
  Background:
    * I connect Web Demo wallet
    * Set existing "thirdMnemonic" wallet with Engagement Points and Engagement Rewards
    * Open wallet dialog from main menu
    * I see my TGD balance in wallet "thirdMnemonic"
    * I close wallet dialog modal
    * I visit Engagement page

  Scenario: Delegate withdraws rewards

    # Set delegate account
    * I type "fourthAccount" address in Delegated withdrawal to field
    * I click the "Set delegate" button
    * I see Tx success screen with existing "fourthAccount" address
    * I click Go to Engagement button

    # Check balance of delegated account
    * I see Delegate field is pre-field with address "fourthAccount"
    * I use existing "fourthMnemonic" mnemonic to make query and check balance "100"

    # Check balance of initial account
    * I see the "Address" field prefilled with my "thirdAccount" wallet
    * I see my Engagement Points "3 / 2034 (0.15%)" and Engagement Rewards "6" TGD
    * I see no any address in the "Receiver address" field

    # Set delegated address mnemonic before withdraw
    * Workaround to clear localstorage
    * I connect Web Demo wallet
    * Set existing "fourthMnemonic" wallet with Engagement Points and Engagement Rewards
    * I visit Engagement page
    * I enter existing "thirdAccount" address to initial Address field
    * I see my Engagement Points "3 / 2034 (0.15%)" and Engagement Rewards "6" TGD

    # Withdraw rewards
    * I click on the "Withdraw rewards" button
    * I see Tx success screen with existing "thirdAccount" address
    * I click Go to Engagement button

    # Check balance of Delegated address
    * I see my Engagement Points "4 / 2034 (0.20%)" and Engagement Rewards "9" TGD
    * I use existing "fourthMnemonic" mnemonic to make query and check balance "100"
    * Open wallet dialog from main menu
    * I see TGD balance "1006" for random address
    * I close wallet dialog modal

    # Replace delegated address with initial account
    * Workaround to clear localstorage
    * I connect Web Demo wallet
    * Set existing "thirdMnemonic" wallet with Engagement Points and Engagement Rewards
    * I visit Engagement page
    * I see Delegate field is pre-field with address "fourthAccount"
    * I click on the Clear delegate button
    * I see Tx success screen with existing "thirdAccount" address
    * I click Go to Engagement button
    * I see Delegate field is pre-field with address "thirdAccount"

    # Check balance of initial address after
    * I see the "Address" field prefilled with my "thirdAccount" wallet
    * I see my Engagement Points "3 / 2034 (0.15%)" and Engagement Rewards "0" TGD
