Feature: Check validator name, address, slashing events, voting power
  Background:
    * I connect to Web Demo wallet
    * I am a validator
    * I visit Validators

  Scenario: Check my validator data
    * I find my name and address on the list of validators and click on it
    * I see my name, address, slashing events, and voting power on the Validator Detail modal
