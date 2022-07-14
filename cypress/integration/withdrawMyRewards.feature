Feature: Withdraw my rewards to my address
  Background:
    * I visit Trusted Circle page
    * I connect to Web Demo wallet
    * Set wallet with Engagement Points and Engagement Rewards
    * Open wallet dialog
    * I see my TGD balance "232"
    * I visit Engagement page

  Scenario: Withdraw rewards
    * I see the "Address" field prefilled with my address
    * I see my Engagement Points and Engagement Rewards
    * I click on the "Withdraw rewards" button
    * I see Tx success screen
    * I check that my TGD balance has gone up
