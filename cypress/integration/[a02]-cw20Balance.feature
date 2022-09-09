Feature: See my CW20 tokens that I have pinned and have non zero balance
  Background:
    * I connect Web Demo wallet
    * I visit T-Market page

    # Create CW20 token called CWA
    * I click on Create Asset button
    * I enter Token symbol "CWA"
    * I enter Token name "Contract20WS"
    * I enter "1000" to Initial supply field
    * I enter "1" to Set decimal places field
    * I click Next button
    * I leave Trusted Circle to associate field empty
    * I click on Create Asset button in modal dialog
    * I see Tx success screen with created "Contract20WS" token name
    * I click on Go to T-Market button

  Scenario: Check CWA balance
    * Open wallet dialog from main menu
    * I see "100" balance for "CWA" token
