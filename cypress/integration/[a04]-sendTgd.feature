Feature: Send Tgrade tokens to an address
  Background:
    * I connect Web Demo wallet
    * Set "randomMnemonic03" wallet without Engagement Points and Engagement Rewards
    * Send 10 tokens to "randomMnemonic03" address
    * Open wallet dialog from main menu
    * I see "20" balance for "TGD" token

  Scenario: Send TGD
    * I click on token with "TGD" symbol
    * I see "20" balance for "TGD" token
    * I enter amount "4" to send
    * I enter recipient address from "randomMnemonic04"
    * I click Send tokens button
    * I see Tx success screen with address from "randomMnemonic04"
    * I click Go to Wallet button
    * I use "randomMnemonic04" to make query and check balance of this address "400"
    * I see "15.99" balance for "TGD" token
