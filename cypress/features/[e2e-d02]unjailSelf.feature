Feature: Unjail self if jailing duration has expired
  Background:
    * I connect to Web Demo wallet
    * I am a jailed validator whose jailing period has finished
    * I visit Validators

  Scenario: Unjail myself
    * I find my name and address on the list of validators and click on it
    * I see the Validator Detail modal
    * I click on the "Unjail self" button
    * I see Tx success screen
