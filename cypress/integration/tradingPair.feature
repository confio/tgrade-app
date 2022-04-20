Feature: Trading pair
  Background:
    * I visit Trusted Circle page
    * I connect to Web Demo wallet

  Scenario: Create Trading pair
    # Create TC
    * I click on Add Trusted Circle button
    * I click on Create Trusted Circle button
    * I enter Trusted Circle name as "My Trusted Circle # "
    * I click on Next button Step#1 in modal popup
    * I click on Next button Step#2 in modal popup
    * I click on Sign transaction and pay escrow button on Step#3
    * I see Your transaction was approved! message
    * I click on Go to Trusted Circle details button
    * I see that "My Trusted Circle #" is created

    # Create Asset
    * Go to T-Market page
    * I click on Create Asset button
    * I enter token Symbol
    * I enter token Name
    * I enter Initial supply "1000"
    * I enter decimals "1"
    * I click Next button
    * I enter Trusted Circle address
    * I click on Create Asset button in modal dialog
    * I click on Go to T-Market button

    # Create pair
    * I click on Provide Liquidity tab


