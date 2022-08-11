Feature: Withdraw my rewards to another address
  Background:
    * I connect Web Demo wallet
    * Set "first" wallet with Engagement Points and Engagement Rewards
    * Open wallet dialog
    * I see my TGD balance in wallet "first"
    * I close wallet dialog modal
    * I visit Engagement page

  Scenario: Withdraw rewards to another
    * I see the "Address" field prefilled with my "first" wallet
    * I see my Engagement Points "1000 / 2034 (49.16%)" and Engagement Rewards "185" TGD
    * I enter the address of the other account in the "Receiver address" field
    * I click on the "Withdraw rewards" button
    * I see Tx success screen with my address "first"
    * I click Go to Engagement button
    * I see my Engagement Points "1000 / 2034 (49.16%)" and Engagement Rewards "0" TGD
    * I check balance on new receive address "185"
