Feature: Withdraw rewards as delegate
  Background:
    * I connect Web Demo wallet
    * Set validator with "node0Mnemonic" mnemonic
    * Open wallet dialog from main menu
    * I see TGD balance "1000" for random address
    * I close wallet dialog modal
    * I open Governance menu
    * I visit Validators page
    * I click on "node0Account" address on the list of validators
    * I see validator's address "node0Account" with related account "node0Account" name
    #* I find my name and address on the list of validators and click on it
    #* I click on the "Claim rewards" button

  Scenario: Delegate withdraws rewards
    # Set delegate
    #* I enter the address of a known account on the "Delegated withdrawal to" field
    #* I click the "Set delegate" button
    #* I see Tx success screen and close it
    # Withdr#aw rewards
    #* I change to the delegate account
    #* I visit Distributed
    #* I enter the initial account's address on the "Address" field
    #* I see the initial account's Distributed Points and Distributed Rewards
    #* I click on the "Withdraw rewards" button
    #* I see Tx success screen and close it
    #* I check that the delegate account's TGD balance has gone up
    # Clear delegate
    #* I change to the initial account
    #* I visit Distributed
    #* I see the delegate account's address prefilled on the "Delegated withdrawal to" field
    #* I click on the "Clear delegate" button
    #* I see Tx success screen and close it
    #* I change to the previously delegate account
    #* I visit Distributed
    #* I enter the initial account's address on the "Address" field
    #* I see the initial account's Distributed Points and Distributed Rewards
    #* I see I can no longer withdraw rewards for the initial account
