Feature: Withdraw rewards as delegate to another address
  Background:
    * I connect Web Demo wallet
    * Set "sixthMnemonic" wallet with Engagement Points and Engagement Rewards
    * Open wallet dialog from main menu
    * I see my TGD balance in wallet "sixthMnemonic"
    * I close wallet dialog modal
    * I visit Engagement page

  Scenario: Delegate withdraws rewards to another address

    # Set delegate account
    * I type "firstAccount" address in Delegated withdrawal to field
    * I click the "Set delegate" button
    * I see Tx success screen with "firstAccount" delegated address
    * I click Go to Engagement button
    * I see there is existing "firstAccount" address set in Delegate withdrawal field
    * I see the "Address" field prefilled with my "sixthAccount" wallet
    * I see my Engagement Points "8 / 2034 (0.39%)" and Engagement Rewards "15" TGD

    # Fill "Receiver address" field
    * I enter existing "thirdAccount" address in the "Receiver address" field

    # Withdraw rewards
    * I use existing "thirdMnemonic" mnemonic of receive address to query balance "101"
    * I click on the "Withdraw rewards" button
    * I see Tx success screen with existing "thirdAccount" address
    * I click Go to Engagement button
    * I use existing "thirdMnemonic" mnemonic of receive address to query balance "102"

    # Clear delegate, change to the initial account
    * I see Delegate withdrawal to field is pre-field with "firstAccount" address
    * I click on the Clear delegate button
    * I see Tx success screen with initial "sixthAccount" delegated address
    * I click Go to Engagement button
    * I see Delegate withdrawal to field is pre-field with existing "sixthAccount" address

    # I can no longer withdraw rewards for the initial account
    * I see the "Address" field prefilled with my "sixthAccount" wallet
    * I see my Engagement Points "8 / 2034 (0.39%)" and Engagement Rewards "0" TGD
    * I see no any address in the "Receiver address" field
