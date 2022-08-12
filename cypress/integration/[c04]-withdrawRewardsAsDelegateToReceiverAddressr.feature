Feature: Withdraw rewards as delegate to another address
  Background:
    * I connect Web Demo wallet
    * Set "third" wallet with Engagement Points and Engagement Rewards
    * Open wallet dialog
    * I see my TGD balance in wallet "third"
    * I close wallet dialog modal
    * I visit Engagement page

  Scenario: Delegate withdraws rewards to another address

    # Set delegate
    * I type "randomSecond" address in Delegated withdrawal to field
    * I click the "Set delegate" button
    * I see Tx success screen with "randomSecond" delegated address
    * I click Go to Engagement button
    * I see there is random "randomSecond" address set in Delegate withdrawal field

    # Withdraw rewards
    * I see the "Address" field prefilled with my "third" wallet
    #* I see my Engagement Points "5 / 2034 (0.25%)" and Engagement Rewards "9" TGD
    #* I enter the address of the other account in the "Receiver address" field
    #* I see the initial account's Engagement Points and Engagement Rewards
    #* I enter the address of the other account on the "Receiver address" field
    #* I click on the "Withdraw rewards" button
    #* I see Tx success screen and close it
    #* I check that the random account's TGD balance has gone up

    # Clear delegate
    #* I change to the initial account
    #* I visit Engagement
    #* I see the delegate account's address prefilled on the "Delegated withdrawal to" field
    #* I click on the "Clear delegate" button
    #* I see Tx success screen and close it
    #* I change to the previously delegate account
    #* I visit Engagement
    #* I enter the initial account's address on the "Address" field
    #* I see the initial account's Engagement Points and Engagement Rewards
    #* I see I can no longer withdraw rewards for the initial account
