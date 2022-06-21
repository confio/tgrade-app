Feature: Send Tgrade tokens to an address
  Background:
    * I connect to Web Demo wallet
    * I click on my address on the side menu

  Scenario: Send TGD
    * I click on TGD token
    * I enter "1" in amount field
    * I enter a random address in recipient field
    * I click send
    * I see Tx success screen
