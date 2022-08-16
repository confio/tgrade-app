Feature: Withdraw my rewards to another address
  Background:
    * I connect Web Demo wallet
    * Set "secondMnemonic" wallet with Engagement Points and Engagement Rewards
    * Open wallet dialog from main menu
    * I see my TGD balance in wallet "secondMnemonic"
    * I close wallet dialog modal
    * I visit Engagement page

  Scenario: Withdraw rewards using "Receiver address"

    # Check balance of initial address before
    * I see the "Address" field prefilled with my "secondAccount" wallet
    * I see my Engagement Points "7 / 2034 (0.34%)" and Engagement Rewards "14" TGD

    # Set receiver address
    * I enter address in the "Receiver address" field from "randomMnemonicFirst" wallet
    * I use "randomMnemonicFirst" to make query and check balance of this address "0"

    # Withdraw rewards
    * I click on the "Withdraw rewards" button
    * I see Tx success screen with address from "randomMnemonicFirst"
    * I click Go to Engagement button
    * I see my Engagement Points "7 / 2034 (0.34%)" and Engagement Rewards "0" TGD

    # Check receiver address balance
    * I use "randomMnemonicFirst" to make query and check balance of this address "14"
