Feature: Create, vote, and execute "Register upgrade" proposal
  Background:
    * I connect to Web Demo wallet
    * I am a validator (account A)
    * The are 2 other validators (accounts B and C)
    * I visit Validators

  Scenario: Propose Register upgrade
    # Create proposal
    * I click on the "Add proposal" button
    * I see the "New proposal" modal and select "Register upgrade"
    * I click on "Next"
    * I enter some text on the "Name" field
    * I enter a number on the "Upgrade at height" field
    * I enter some text on the "Upgrade info" field
    * I enter a comment on the "Comment" field
    * I click on "Create proposal"
    * I see a confirmation screen with the entered data
    * I click on "Confirm proposal"
    * I see Tx success screen and close it
    # Vote No on proposal
    * I change to account B
    * I see the newly created proposal on the proposals table and click on it
    * I see the "Proposal detail" modal and click on "No"
    * I see Tx success screen and close it
    # Vote Yes on proposal
    * I change to account C
    * I see the newly created proposal on the proposals table and click on it
    * I see the "Proposal detail" modal and click on "Yes"
    * I see Tx success screen and close it
    # Execute proposal
    * I see the newly created proposal on the proposals table and click on it
    * I see the "Proposal detail" modal and click on "Execute Proposal"
    * I see Tx success screen
