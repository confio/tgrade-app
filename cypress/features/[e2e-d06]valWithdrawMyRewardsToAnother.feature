Feature: Withdraw my rewards to another address
  Background:
    * I connect to Web Demo wallet
    * I have some Distributed Points and Distributed Rewards
    * I check the TGD balance of another address
    * I visit Validators
    * I find my name and address on the list of validators and click on it
    * I click on the "Claim rewards" button

  Scenario: Withdraw rewards to another
    * I see the "Address" field prefilled with my address
    * I see my Distributed Points and Distributed Rewards
    * I enter the address of the other account on the "Receiver address" field
    * I click on the "Withdraw rewards" button
    * I see Tx success screen
    * I check that the other account's TGD balance has gone up
