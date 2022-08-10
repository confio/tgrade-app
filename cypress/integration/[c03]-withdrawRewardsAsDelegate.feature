Feature: Withdraw rewards as delegate
  Background:
    * I connect Web Demo wallet
    * Set "second" wallet with Engagement Points and Engagement Rewards
    * Open wallet dialog
    * I see my TGD balance in wallet "second"
    * I close wallet dialog modal
    * I visit Engagement page

  Scenario: Delegate withdraws rewards
    # Set delegate
    * I enter the address of a known account in Delegated withdrawal to field
    * I click the "Set delegate" button
    * I see Tx success screen with new delegated address
    * I click Go to Engagement button
    * I see delegate address is still percent in the field

    # Withdraw rewards
    #* I change to the delegate account
    #* I visit Engagement
    #* I enter the initial account's address on the "Address" field
    #* I see the initial account's Engagement Points and Engagement Rewards
    #* I click on the "Withdraw rewards" button
    #* I see Tx success screen and close it
    #* I check that the delegate account's TGD balance has gone up

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
