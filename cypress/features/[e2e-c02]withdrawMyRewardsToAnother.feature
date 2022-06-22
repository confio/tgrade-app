Feature: Withdraw my rewards to another address
  Background:
    * I connect to Web Demo wallet
    * I have some Engagement Points and Engagement Rewards
    * I check the TGD balance of another address
    * I visit Engagement

  Scenario: Withdraw rewards to another
    * I see the "Address" field prefilled with my address
    * I see my Engagement Points and Engagement Rewards
    * I enter the address of the other account on the "Receiver address" field
    * I click on the "Withdraw rewards" button
    * I see Tx success screen
    * I check that the other account's TGD balance has gone up
