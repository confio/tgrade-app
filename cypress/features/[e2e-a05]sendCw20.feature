Feature: Send CW20 tokens to an address
  Background:
    * I connect to Web Demo wallet
    * I visit T-Market
    * I create a CW20 token called CWA
    * I click on my address on the side menu

  Scenario: Send CWA
    * I click on CWA token
    * I enter "1" in amount field
    * I enter a random address in recipient field
    * I click send
    * I see Tx success screen
