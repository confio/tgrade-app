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
    await screen.findByText(myTstBalance);

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
    await screen.findByText("1500");

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
    await screen.findByText("800");
  }, 75_000);

  // TODO: finish this test
  test.skip("staking", async () => {
    const stakeAmount = "0.2";

    render(<App />);

    // Login with browser button and go to staking
    userEvent.click(screen.getByRole("button", { name: /browser/i }));
    userEvent.click(await screen.findByText(/staking/i, undefined, { timeout: 10_000 }));

    // Go to validator node001 and check staked 0 tokens
    userEvent.click(await screen.findByText(/node001/i));
    const stakedTokens = (await screen.findByText(/staked tokens/i)).nextElementSibling;
    expect(stakedTokens).toHaveTextContent("0");

    // Delegate 4 tokens and check new staked
    userEvent.click(screen.getByRole("button", { name: /^delegate/i }));
    const stakeAmountInput = screen.getByPlaceholderText(/enter amount/i) as HTMLInputElement;
    await waitFor(() => userEvent.type(stakeAmountInput, stakeAmount, { delay: 1 }));
    // TODO: why this button is disabled
    userEvent.click(screen.getByRole("button", { name: /delegate/i }));
    screen.debug();
  }, 99_999);
});
