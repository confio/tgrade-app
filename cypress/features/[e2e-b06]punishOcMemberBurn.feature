Feature: Punish Oversight Community members proposal with "burn_escrow"
  Background:
    * I connect to Web Demo wallet
    * I am an Oversight Community member with voting rights (account A)
    * The Oversight Community has 3 other members with voting rights (accounts B, C, and D)
    * I visit the Oversight Community

  Scenario: Propose punish OC member and burn
    # Create proposal
    * I click on the "Add proposal" button
    * I see the "New proposal" modal and select "Punish Oversight Community member"
    * I click on "Next"
    * I enter account D's address on the "Member to be punished" field
    * I click on the checkbox "Kick out from Trusted Circle"
    * I enter a number between 0 and 100 on the "% of escrow to be slashed" field
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
