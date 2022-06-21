Feature: Unstake tokens
  Background:
    * I connect to Web Demo wallet
    * I am a validator
    * I visit Validators

  Scenario: Unstake
    * I find my name and address on the list of validators and click on it
    * I see the Validator Detail modal
    * I click on the "Unstake" button
    * I see the Unstake form modal
    * I input some amount to be unstaked
    * I see how the input has changed my potential voting power
    * I click on the "Unstake tokens" button
    * I see Tx success screen
