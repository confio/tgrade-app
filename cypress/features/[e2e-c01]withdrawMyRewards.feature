Feature: Withdraw my rewards to my address
  Background:
    * I connect to Web Demo wallet
    * I have some Engagement Points and Engagement Rewards
    * I check my TGD balance
    * I visit Engagement

  Scenario: Withdraw rewards
    * I see the "Address" field prefilled with my address
    * I see my Engagement Points and Engagement Rewards
    * I click on the "Withdraw rewards" button
    * I see Tx success screen
    * I check that my TGD balance has gone up
