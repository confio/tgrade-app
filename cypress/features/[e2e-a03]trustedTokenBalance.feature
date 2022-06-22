Feature: See my Trusted tokens that I have pinned and have non zero balance
  Background:
    * I connect to Web Demo wallet
    * I visit T-Market
    * I create a Trusted token called TTA
    * I click on my address on the side menu

  Scenario: Check TTA balance
    * I see I have some balance for TTA token
