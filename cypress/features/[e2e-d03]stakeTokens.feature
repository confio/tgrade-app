Feature: Stake tokens
  Background:
    * I connect to Web Demo wallet
    * I am a validator
    * I visit Validators

  Scenario: Stake
    * I find my name and address on the list of validators and click on it
    * I see the Validator Detail modal
    * I click on the "Stake" button
    * I see the Stake form modal
    * I input some liquid amount and some vesting amount
    * I see how the input has changed my potential voting power
    * I click on the "Stake tokens" button
    * I see Tx success screen
