Feature: Withdraw rewards as delegate
  Background:
    * I connect Web Demo wallet
    * Set "third" wallet with Engagement Points and Engagement Rewards
    * Open wallet dialog
    * I see my TGD balance in wallet "third"
    * I close wallet dialog modal
    * I visit Engagement page

  Scenario: Delegate withdraws rewards

    # Set delegate
    * I type "randomFirst" address in Delegated withdrawal to field
    * I click the "Set delegate" button
    * I see Tx success screen with "randomFirst" delegated address
    * I click Go to Engagement button
    * I see there is "randomFirst" address set in Delegate withdrawal field

    # Withdraw rewards to Delegated address with empty "Receiver address" field
    * I see the "Address" field prefilled with my "third" wallet
    * I see my Engagement Points "5 / 2034 (0.25%)" and Engagement Rewards "9" TGD
    * I see no any address in the "Receiver address" field
    * I click on the "Withdraw rewards" button
    * I see Tx success screen with my address "third"
    * I click Go to Engagement button
    * I see my Engagement Points "5 / 2034 (0.25%)" and Engagement Rewards "0" TGD
    #* I check that the delegate account's TGD balance has gone up
    #* I check balance on new receive address "9" //tgrade-app/issues/798

    # Clear delegate then change it to the initial account
    * I see there is "randomFirst" address set in Delegate withdrawal field
    * I click on the Clear delegate button
    * I click Go to Engagement button
    * I see there is "third" address set in Delegate withdrawal field
    * I see Tx success screen with "third" delegated address
    * I click Go to Engagement button
    * I see Delegate withdrawal to field is pre-field with "third" address

    # Check Engagement rewards of initial account
    * I see the "Address" field prefilled with my "third" wallet
    * I see my Engagement Points "5 / 2034 (0.25%)" and Engagement Rewards "0" TGD
    * I see no any address in the "Receiver address" field
    * I see I can no longer withdraw rewards for the initial account
