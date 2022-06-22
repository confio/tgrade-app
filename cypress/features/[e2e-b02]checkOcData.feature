Feature: Check address, that address can be copied, voting rules, and half-life data of Oversight Community
  Background:
    * I connect to Web Demo wallet
    * I visit the Oversight Community

  Scenario: Check OC data
    # Check and copy address
    * I see the address of the OC
    * I click on the address of the OC
    * I check that my clipboard now contains the address of the OC
    # Check other data
    * I see the current voting rules for the Oversight Community
    * I see the half-life data for the Oversight Community
