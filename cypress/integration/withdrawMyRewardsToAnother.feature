Feature: Withdraw my rewards to another address
  Background:
    * I connect Web Demo wallet
    * Set wallet with Engagement Points and Engagement Rewards
    * Open wallet dialog
    * I see my TGD balance "998"
    * I close wallet dialog modal
    * I visit Engagement page

  Scenario: Withdraw rewards to another
    * I see the "Address" field prefilled with my "tgrade1kalzk5cvq5yu6f5u73k7r905yw52sawckddsc3"
    * I see my Engagement Points "1000 / 2034 (49.16%)" and Engagement Rewards "9"
    * I enter the address "tgrade1tsg4wldpwyehhkqx3za78ygkzatncxxup96k7h" of the other account on the "Receiver address" field
    * I click on the "Withdraw rewards" button
    * I see Tx success screen with my address "tgrade1tsg4wldpwyehhkqx3za78ygkzatncxxup96k7h"
    * I click Go to Engagement button
    * I see my Engagement Points "1000 / 2034 (49.16%)" and Engagement Rewards "0 TGD"
