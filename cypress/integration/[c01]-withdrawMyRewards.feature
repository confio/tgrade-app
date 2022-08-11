Feature: Withdraw my rewards to my address
  Background:
    * I connect Web Demo wallet
    * Set "second" wallet with Engagement Points and Engagement Rewards
    * Open wallet dialog
    * I see my TGD balance in wallet "second"
    * I close wallet dialog modal
    * I visit Engagement page

  Scenario: Withdraw rewards
    * I see the "Address" field prefilled with my "second" wallet
    * I see my Engagement Points "7 / 2034 (0.34%)" and Engagement Rewards "13" TGD
    * I click on the "Withdraw rewards" button
    * I see Tx success screen with my address "second"
    * I click Go to Engagement button
    * I see my Engagement Points "7 / 2034 (0.34%)" and Engagement Rewards "0" TGD
    * Open wallet dialog
    * I check that my TGD balance has gone up "10"
