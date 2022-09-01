@job_01
Feature: Withdraw my rewards to another address
  Background:
    * I connect Web Demo wallet
    * Set existing "secondMnemonic" wallet with Engagement Points and Engagement Rewards
    * Open wallet dialog from main menu
    * I see my TGD balance in wallet "secondMnemonic"
    * I close wallet dialog modal
    * I visit Engagement page

  Scenario: Withdraw rewards using "Receiver address"

    # Check balance of initial address before
    * I see the "Address" field prefilled with my "secondAccount" wallet
    * I see Engagement Points "7 / 2034 (0.34%)" and Engagement Rewards "14" TGD

    # Set receiver address
    * I enter address in the "Receiver address" field from "randomMnemonic01" wallet
    * I use "randomMnemonic01" to make query and check balance of this address "0"

    # Withdraw rewards
    * I click on the "Withdraw rewards" button
    * I see Tx success screen with address from "randomMnemonic01"
    * I click Go to Engagement button
    * I see Engagement Points "7 / 2034 (0.34%)" and Engagement Rewards "0" TGD

    # Check receiver address balance
    * I use "randomMnemonic01" to make query and check balance of this address "14"
