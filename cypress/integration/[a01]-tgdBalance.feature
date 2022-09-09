Feature: See my Tgrade token balance
  Background:
    * I connect Web Demo wallet
    * Open wallet dialog from main menu

  Scenario: Check TGD balance
    * I see "10" balance for "TGD" token
