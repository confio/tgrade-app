Feature: Withdraw my rewards to my address
  Background:
    * I connect Web Demo wallet
    * Set existing "firstMnemonic" wallet with Engagement Points and Engagement Rewards
    * Open wallet dialog from main menu
    * I see my TGD balance in wallet "firstMnemonic"
    * I close wallet dialog modal
    * I visit Engagement page

  Scenario: Withdraw rewards

    # Check balance of initial address before
    * I see the "Address" field prefilled with my "firstAccount" wallet
    * I see Engagement Points "5 / 2034 (0.25%)" and Engagement Rewards "9" TGD

    # Withdraw rewards
    * I click on the "Withdraw rewards" button
    * I see Tx success screen with existing "firstAccount" address
    * I click Go to Engagement button

    # Check balance of initial address after
    * I see Engagement Points "5 / 2034 (0.25%)" and Engagement Rewards "0" TGD
    * Open wallet dialog from main menu
    * I see that TGD balance "1009" has gone up for "firstAccount" address
