Feature: Trusted Circle page

  I want to create Trusted Circle

  Background:
    * I visit Trusted Circle page

  Scenario: Create trusted circle
    * I click on Add Trusted Circle button
    * I click on Create Trusted Circle button
    * I enter Trusted Circle name as "TC Test #6"
    * I click on Next button step#1 of Start Trusted Circle modal popup
    * I click on Next button step#2 of Start Trusted Circle modal popup
    * I click Connect wallet button on step#3
    * I select Web wallet demo
    * I click on Sign transaction and pay escrow button
    * I click on Go to Trusted Circle details button
    * I see that "TC Test #6" is created
