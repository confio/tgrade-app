Feature: Withdraw rewards as delegate
  Background:
    * I connect Web Demo wallet
    * Set "fourthMnemonic" wallet with Engagement Points and Engagement Rewards
    * Open wallet dialog from main menu
    * I see my TGD balance in wallet "fourthMnemonic"
    * I close wallet dialog modal
    * I visit Engagement page

  Scenario: Delegate withdraws rewards

    # Set delegate
    * I type "fifthAccount" address in Delegated withdrawal to field
    * I click the "Set delegate" button
    * I see Tx success screen with "fifthAccount" delegated address
    * I click Go to Engagement button
    * I see Delegate withdrawal to field is pre-field with "fifthAccount" address
    * I use existing "fifthMnemonic" mnemonic of receive address to query balance "100"

    # Withdraw rewards to Delegated address with empty "Receiver address" field
    * I see the "Address" field prefilled with my "fourthAccount" wallet
    * I see my Engagement Points "4 / 2034 (0.20%)" and Engagement Rewards "7" TGD
    * I see no any address in the "Receiver address" field
    * I click on the "Withdraw rewards" button
    #* I see Tx success screen with existing "fifthAccount" address //tgrade-app/issues/798
    * I click Go to Engagement button

    # Check balance of Delegated address
    * I see my Engagement Points "4 / 2034 (0.20%)" and Engagement Rewards "0" TGD
    #* I use existing "fifthMnemonic" mnemonic of receive address to query balance "18"
    #* I check that the delegate account's TGD balance has gone up
    #* I check balance on new receive address "9" //tgrade-app/issues/798

    # Replace delegated address with initial account
    * I see Delegate withdrawal to field is pre-field with "fifthAccount" address
    * I click on the Clear delegate button
    * I see Tx success screen with initial "fourthAccount" delegated address
    * I click Go to Engagement button
    * I see Delegate withdrawal to field is pre-field with existing "fourthAccount" address

    # I can no longer withdraw rewards for the initial account
    * I see the "Address" field prefilled with my "fourthAccount" wallet
    * I see my Engagement Points "4 / 2034 (0.20%)" and Engagement Rewards "0" TGD
