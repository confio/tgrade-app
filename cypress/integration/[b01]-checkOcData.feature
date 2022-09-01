@job_01
Feature: Check address, that address can be copied, voting rules, and half-life data of Oversight Community
  Background:
    * I connect Web Demo wallet
    * Set existing "adminAccount" wallet with Engagement Points and Engagement Rewards
    * I open Governance menu
    * I visit Oversight Community page
    * I see "Your escrow" because I am member of OC

  Scenario: Check OC data
    # Check and copy address
    * I see the address of the OC
    * I click on the address of the OC
    * I check that my clipboard now contains the address of the OC

    # Check other data
    * I see the current voting rules for the Oversight Community
    * I see the half-life data for the Oversight Community
