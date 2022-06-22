Feature: Send Trusted tokens to an address
  Background:
    * I connect to Web Demo wallet
    * I visit Trusted Circle
    * I create a Trusted Circle called My TC with a participant
    * I visit T-Market
    * I create a Trusted token called TTA associated with My TC
    * I click on my address on the side menu

  Scenario: Send TTA
    * I click on TTA token
    * I enter "1" in amount field
    * I enter My TC's participant's address in recipient field
    * I click send
    * I see Tx success screen
