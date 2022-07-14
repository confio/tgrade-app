Feature: Withdraw my rewards to my address
  Background:
    * I connect Web Demo wallet
    * Set wallet with Engagement Points and Engagement Rewards
    * Open wallet dialog
    * I see my TGD balance "998"
    * I close wallet dialog modal
    * I visit Engagement page

  Scenario: Withdraw rewards
    * I see the "Address" field prefilled with my "tgrade1kalzk5cvq5yu6f5u73k7r905yw52sawckddsc3"
    * I see my Engagement Points "1000 / 2034 (49.16%)" and Engagement Rewards "916"
    #* I click on the "Withdraw rewards" button
    #* I see Tx success screen
    #* I check that my TGD balance has gone up
