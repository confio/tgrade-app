Feature: Trading pair
  Background:
    * I connect Web Demo wallet

  Scenario: Create Trading pair
    # Create TC
    * I click on Add Trusted Circle button
    * I click on Create Trusted Circle button
    * I enter Trusted Circle name as "My Trusted Circle # "
    * I click on Next button Step#1 in modal dialog
    * I click on Next button Step#2 in modal dialog
    * I click on Sign transaction and pay escrow button on Step#3
    * I see Your transaction was approved! message
    * I click on Go to Trusted Circle details button
    * I see that "My Trusted Circle #" is created

    # Create Asset
    * I visit T-Market page
    * I click on Create Asset button
    * I enter Token symbol "SUST"
    * I enter Token name "Test Sustainability Asset"
    * I enter "1000" to Initial supply field
    * I enter "1" to Set decimal places field
    * I click Next button
    * I enter Trusted Circle address
    * I click on Create Asset button in modal dialog
    * I click on Go to T-Market button

    # Create pair
    * I click on Provide Liquidity tab
    * I select TGD token FROM drop down
    * I select my created token in TO drop down
    * I click on Create Pair button

    # Create Whitelist proposal
    * Go to Trusted Circle page
    * I click on Add proposal button
    * I select Whitelist Pair option
    * I click Next button
    * I select Trading Pair from drop down
    * I click on Create proposal button
    * I click Confirm proposal button
    * I see Your transaction was approved message
    * I click on Go to Trusted Circle details button
    * I see created Whitelist pair proposal

    # Execute Whitelist proposal
    * I click on Whitelist pair button to open proposal
    * I click on Execute Proposal button
    * I click on Go to Trusted Circle details button
    * I see proposal has change state to Executed

    # Provide Liquidity
    * I visit T-Market page
    * I click on Provide Liquidity tab
    * I select TGD token FROM drop down
    * I select my created token in TO drop down
    * I click on Approve SUST button
    * I enter value for TGN token "5"
    * I enter value for my created token "1"
    * I click on Provide button
    * I see Complete message
    * I click Ok button
    * I redirected back to Provided Liquidity tab

    # Exchange tokens
    * I click on Exchange tab
    * I select TGD token FROM drop down
    * I select my created token in TO drop down
    * I enter value for TGN token "1" Exchange tab
    * I see amount of my token "0.2" Exchange tab
    # TODO check fees
    * I click on Swap button
    * I see Complete message



