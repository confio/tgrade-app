import { render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import App from "./";

describe("should have a happy path for", () => {
  const emptyAddress = "wasm10tsncqntt778xpkt7d5uwhul2rcmlj5c3larlj";

  test("native wallet", async () => {
    const cosmAmount = "1.5";

    render(<App />);

    // Login with browser button
    userEvent.click(screen.getByRole("button", { name: /browser/i }));

    // Check correct balance of cosm and stake
    const cosmButton = await screen.findByRole("button", { name: /cosm/i }, { timeout: 10_000 });
    expect(cosmButton).toHaveTextContent(/cosm10/i);
    const stakeButton = screen.getByRole("button", { name: /stake/i });
    expect(stakeButton).toHaveTextContent(/stake10/i);

    // Go to Cosm detail with send form
    userEvent.click(cosmButton);

    // Enter amount and address
    const sendAmountInput = screen.getByPlaceholderText(/enter amount/i) as HTMLInputElement;
    await userEvent.type(sendAmountInput, cosmAmount, { delay: 1 });
    const sendAddressInput = screen.getByPlaceholderText(/enter address/i) as HTMLInputElement;
    await userEvent.type(sendAddressInput, emptyAddress, { delay: 1 });

    // Submit and expect success screen
    userEvent.click(screen.getByRole("button", { name: /send/i }));
    await screen.findByText(`${cosmAmount} COSM successfully sent to ${emptyAddress}`, undefined, {
      timeout: 10_000,
    });

    // Go to token list
    userEvent.click(screen.getByRole("button", { name: /tokens/i }));

    // Check that cosm balance went down
    const newCosmTokens = (await screen.findByText(/cosm/i)).nextElementSibling;
    expect(newCosmTokens).toHaveTextContent("8.498");

    // Check other account went up
    const searchAddressInput = screen.getByPlaceholderText(/enter address/i) as HTMLInputElement;
    userEvent.clear(searchAddressInput);
    await userEvent.type(searchAddressInput, emptyAddress, { delay: 1 });
    userEvent.click(screen.getByRole("button", { name: /search/i }));
    const otherCosmTokens = await screen.findByText(cosmAmount);
    expect(otherCosmTokens.previousElementSibling).toHaveTextContent(/cosm/i);
  }, 30_000);

  test("cw20 wallet", async () => {
    const tokenSymbol = "TST";
    const tokenName = "TST coin";
    const initialSupply = "1000000000";
    const mintCapAmount = "2000000000";
    const myTstBalance = "1000";
    const mintMoreAmount = "500";
    const tstAmount = "700";

    render(<App />);

    // Login with browser button and go to cw20 wallet
    userEvent.click(screen.getByRole("button", { name: /browser/i }));
    userEvent.click(await screen.findByText(/cw20 wallet/i, undefined, { timeout: 10_000 }));

    // Create new token
    userEvent.click(await screen.findByText(/create new token/i));
    const tokenSymbolInput = screen.getByPlaceholderText(/enter symbol/i) as HTMLInputElement;
    await userEvent.type(tokenSymbolInput, tokenSymbol, { delay: 1 });
    const tokenNameInput = screen.getByPlaceholderText(/enter token name/i) as HTMLInputElement;
    await userEvent.type(tokenNameInput, tokenName, { delay: 1 });
    const decimalsInput = screen.getByPlaceholderText(/select number/i) as HTMLInputElement;
    await userEvent.type(decimalsInput, "6", { delay: 1 });
    const initialSupplyInput = screen.getByPlaceholderText(/enter number/i) as HTMLInputElement;
    await userEvent.type(initialSupplyInput, initialSupply, { delay: 1 });
    userEvent.click(screen.getByRole("combobox"));
    userEvent.click(screen.getByText("Fixed cap"));
    const mintCapInput = screen.getByPlaceholderText(/enter amount/i) as HTMLInputElement;
    const createButton = screen.getByRole("button", { name: /create/i });
    await waitFor(
      async () => {
        // Clear and write input until mintCap takes value
        userEvent.clear(mintCapInput);
        await userEvent.type(mintCapInput, mintCapAmount, { delay: 1 });
        expect(mintCapInput.value).toBe(mintCapAmount);
      },
      { timeout: 10_000 },
    );

    // Wait input until mintCap validates
    await waitForElementToBeRemoved(() =>
      screen.getByText("Cap must be equal or greater than initial supply"),
    );
    await waitFor(() => expect(createButton).not.toBeDisabled());
    userEvent.click(createButton);
    await screen.findByText(`${initialSupply} ${tokenName} successfully created`, undefined, {
      timeout: 10_000,
    });

    // Check balance 1000
    userEvent.click(screen.getByRole("button", { name: /token detail/i }));
    await screen.findByText(/tst/i);
    screen.getByText(myTstBalance);
    screen.getByText("tokens");

    // Get my account address
    userEvent.click(screen.getByText(/account/i));
    const myAddress = screen.getByText(/^wasm/i).textContent || "";

    // Mint 500 to my account
    userEvent.click(screen.getByText(/cw20 wallet/i));
    userEvent.click(await screen.findByRole("button", { name: /tst/i }));
    await screen.findByText(myTstBalance);
    userEvent.click(await screen.findByRole("button", { name: /mint tokens/i }));
    const mintMoreInput = screen.getByPlaceholderText(/enter amount/i) as HTMLInputElement;
    await userEvent.type(mintMoreInput, mintMoreAmount, { delay: 1 });
    const mintAddressInput = screen.getByPlaceholderText(/enter address/i) as HTMLInputElement;
    await userEvent.type(mintAddressInput, myAddress, { delay: 1 });
    userEvent.click(screen.getByRole("button", { name: /mint/i }));
    await screen.findByText(
      `${mintMoreAmount} ${tokenSymbol} successfully minted to ${myAddress}`,
      undefined,
      {
        timeout: 10_000,
      },
    );
    userEvent.click(screen.getByRole("button", { name: /token detail/i }));
    await screen.findByText(/tst/i);
    screen.getByText("1500");
    screen.getByText("tokens");

    // Send 700 to another address
    userEvent.click(screen.getByRole("button", { name: /send/i }));

    // Enter amount and address
    const sendAmountInput = screen.getByPlaceholderText(/enter amount/i) as HTMLInputElement;
    await userEvent.type(sendAmountInput, tstAmount, { delay: 1 });
    const sendAddressInput = screen.getByPlaceholderText(/enter address/i) as HTMLInputElement;
    await userEvent.type(sendAddressInput, emptyAddress, { delay: 1 });

    // Submit and expect success screen
    userEvent.click(screen.getByRole("button", { name: /send/i }));
    await screen.findByText(`${tstAmount} ${tokenSymbol} successfully sent to ${emptyAddress}`, undefined, {
      timeout: 10_000,
    });

    // Go to token detail and check my new balance
    userEvent.click(screen.getByRole("button", { name: /token detail/i }));
    await screen.findByText(/tst/i);
    screen.getByText("800");
    screen.getByText("tokens");
  }, 75_000);

  test("staking", async () => {
    const delegateAmount = "4";
    const undelegateAmount = "2";

    render(<App />);

    // Login with browser button and go to staking
    userEvent.click(screen.getByRole("button", { name: /browser/i }));
    userEvent.click(await screen.findByText(/staking/i, undefined, { timeout: 10_000 }));

    // Go to validator node001 and check staked 0 tokens
    userEvent.click(await screen.findByText(/node001/i));
    const stakedTokens = (await screen.findByText(/staked tokens/i)).nextElementSibling;
    expect(stakedTokens).toHaveTextContent("0");

    // Delegate 4 tokens
    userEvent.click(screen.getByRole("button", { name: /^delegate/i }));
    const delegateInput = screen.getByPlaceholderText(/enter amount/i) as HTMLInputElement;
    const delegateButton = screen.getByRole("button", { name: /delegate/i });
    await waitFor(async () => {
      // Clear and write input till maxAmount balance effect kicks in and the form can validate
      userEvent.clear(delegateInput);
      await userEvent.type(delegateInput, delegateAmount, { delay: 1 });
      expect(delegateButton).not.toBeDisabled();
    });
    userEvent.click(delegateButton);
    await screen.findByText(`${delegateAmount} STAKE successfully delegated`, undefined, {
      timeout: 10_000,
    });

    // Check staked tokens is 4
    userEvent.click(screen.getByRole("button", { name: /validator home/i }));
    const stakedTokensAfterDelegate = (await screen.findByText(/staked tokens/i)).nextElementSibling;
    await waitFor(() => {
      expect(stakedTokensAfterDelegate).toHaveTextContent(delegateAmount);
    });

    // Undelegate 2 tokens
    userEvent.click(screen.getByRole("button", { name: /undelegate/i }));
    const undelegateInput = screen.getByPlaceholderText(/enter amount/i) as HTMLInputElement;
    const undelegateButton = screen.getByRole("button", { name: /delegate/i });
    await waitFor(async () => {
      // Clear and write input till maxAmount balance effect kicks in and the form can validate
      userEvent.clear(undelegateInput);
      await userEvent.type(undelegateInput, undelegateAmount, { delay: 1 });
      expect(undelegateButton).not.toBeDisabled();
    });
    userEvent.click(undelegateButton);
    await screen.findByText(`${undelegateAmount} STAKE successfully undelegated`, undefined, {
      timeout: 10_000,
    });

    // Check staked tokens is 2
    userEvent.click(screen.getByRole("button", { name: /validator home/i }));
    const stakedTokensAfterUndelegate = (await screen.findByText(/staked tokens/i)).nextElementSibling;
    await waitFor(() => {
      expect(stakedTokensAfterUndelegate).toHaveTextContent("2");
    });

    // Withdraw rewards
    await waitFor(
      async () => {
        // Enter and exit view until there are rewards (waits for blockchain, not for useEffect)
        userEvent.click(screen.getByRole("button", { name: /rewards/i }));
        try {
          userEvent.click(await screen.findByRole("button", { name: /withdraw rewards/i }));
        } catch (error) {
          userEvent.click(screen.getByAltText(/back arrow/i));
          throw new Error(error);
        }
      },
      { timeout: 10_000 },
    );
    await screen.findByText("Successfully withdrawn", undefined, {
      timeout: 10_000,
    });

    // Logout
    userEvent.click(screen.getByRole("button", { name: /validator home/i }));
    userEvent.click(await screen.findByText(/logout/i));
    expect(screen.getByRole("button", { name: /browser/i })).toBeInTheDocument();
  }, 75_000);
});
