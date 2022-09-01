@job_01
Feature: See my Tgrade token balance
  Background:
    * I connect Web Demo wallet
    * Open wallet dialog from main menu

  Scenario: Check TGD balance
    * I see TGD balance "10" for random address
