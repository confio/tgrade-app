import { Given } from "cypress-cucumber-preprocessor/steps";

// TODO move away this mnemonic to some other file storage
const walletWithEngagementPoints =
  "bone idea foster kid item private figure victory power reflect wrong bunker";

Given("Set wallet with Engagement Points and Engagement Rewards", () => {
  localStorage.setItem("burner-wallet", walletWithEngagementPoints);
});
