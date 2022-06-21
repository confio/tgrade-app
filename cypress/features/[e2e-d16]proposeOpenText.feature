Feature: Create, vote, and execute "Open Text" proposal
  Background:
    * I connect to Web Demo wallet
    * I am a validator (account A)
    * The are 2 other validators (accounts B and C)
    * I visit Validators

  Scenario: Propose open text
   # Create proposal
    * I click on the "Add proposal" button
    * I see the "New proposal" modal and select "Open Text Proposal"
    * I click on "Next"
    * I enter some text on the "Text" field
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
