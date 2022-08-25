Feature: See my CW20 tokens that I have pinned and have non zero balance
  Background:
    * I connect Web Demo wallet
    * I visit T-Market page
    * I create a CW20 token called CWA
    * I click on my address on the side menu

  Scenario: Check CWA balance
    * I see I have some balance for CWA token
