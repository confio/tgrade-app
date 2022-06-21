Feature: Create, vote, and execute "Add Oversight Community members" proposal
  Background:
    * I connect to Web Demo wallet
    * I am an Oversight Community member with voting rights (account A)
    * The Oversight Community has 2 other members with voting rights (accounts B and C)
    * I visit the Oversight Community

  Scenario: Propose Add OC members
    # Create proposal
    * I click on the "Add proposal" button
    * I see the "New proposal" modal and select "Add Oversight Community members"
    * I click on "Next"
    * I enter some random addresses on the "Members to be added" field
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

