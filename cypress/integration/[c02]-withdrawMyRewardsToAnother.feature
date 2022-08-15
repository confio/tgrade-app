Feature: Withdraw my rewards to another address
  Background:
    * I connect Web Demo wallet
    * Set "secondMnemonic" wallet with Engagement Points and Engagement Rewards
    * Open wallet dialog from main menu
    * I see my TGD balance in wallet "secondMnemonic"
    * I close wallet dialog modal
    * I visit Engagement page

  Scenario: Withdraw rewards using "Receiver address"
    * I see the "Address" field prefilled with my "secondAccount" wallet
    * I see my Engagement Points "7 / 2034 (0.34%)" and Engagement Rewards "13" TGD
    * I enter existing "thirdAccount" address in the "Receiver address" field
    * I click on the "Withdraw rewards" button
    * I see Tx success screen with existing "thirdAccount" address
    * I click Go to Engagement button
    * I see my Engagement Points "7 / 2034 (0.34%)" and Engagement Rewards "0" TGD
    * I use existing "thirdMnemonic" mnemonic of receive address to query balance "101"
