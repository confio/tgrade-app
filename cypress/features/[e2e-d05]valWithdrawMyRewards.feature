Feature: Withdraw my rewards to my address
  Background:
    * I connect to Web Demo wallet
    * I have some Distributed Points and Distributed Rewards
    * I check my TGD balance
    * I visit Validators
    * I find my name and address on the list of validators and click on it
    * I click on the "Claim rewards" button

  Scenario: Withdraw rewards
    * I see the "Address" field prefilled with my address
    * I see my Distributed Points and Distributed Rewards
    * I click on the "Withdraw rewards" button
    * I see Tx success screen
    * I check that my TGD balance has gone up
