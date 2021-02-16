import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import App from "./";

test("should have a happy path for native wallet", async () => {
  render(<App />);

  // Login with browser button
  userEvent.click(screen.getByRole("button", { name: /browser/i }));

  // Check correct balance of cosm and stake
  const cosmButton = await screen.findByRole("button", { name: /cosm/i }, { timeout: 10_000 });
  expect(cosmButton).toHaveTextContent(/cosm10/i);
  const stakeButton = screen.getByRole("button", { name: /stake/i });
  expect(stakeButton).toHaveTextContent(/stake10/i);

  // Go to Cosm detail
  userEvent.click(cosmButton);

  // Enter amount and address
  const sendAmountInput = screen.getByPlaceholderText(/enter amount/i) as HTMLInputElement;
  await waitFor(() => userEvent.type(sendAmountInput, "1.5", { delay: 1 }));
  const sendAddressInput = screen.getByPlaceholderText(/enter address/i) as HTMLInputElement;
  await waitFor(() =>
    userEvent.type(sendAddressInput, "wasm10tsncqntt778xpkt7d5uwhul2rcmlj5c3larlj", { delay: 1 }),
  );

  // Submit and expect success screen
  userEvent.click(screen.getByRole("button", { name: /send/i }));
  await screen.findByText(
    "1.5 COSM successfully sent to wasm10tsncqntt778xpkt7d5uwhul2rcmlj5c3larlj",
    undefined,
    { timeout: 10_000 },
  );

  // Go to token list
  userEvent.click(screen.getByRole("button", { name: /tokens/i }));

  // Check that cosm balance went down
  const newCosmTokens = (await screen.findByText(/cosm/i)).nextElementSibling;
  expect(newCosmTokens).toHaveTextContent("8.498");

  // Check other account went up
  const searchAddressInput = screen.getByPlaceholderText(/enter address/i) as HTMLInputElement;
  userEvent.clear(searchAddressInput);
  await waitFor(() =>
    userEvent.type(searchAddressInput, "wasm10tsncqntt778xpkt7d5uwhul2rcmlj5c3larlj", { delay: 1 }),
  );
  userEvent.click(screen.getByRole("button", { name: /search/i }));
  // TODO: find way to wait until cosmjs to that of the other account
  const otherCosmTokens = (await screen.findByText(/cosm1.5/i)).nextElementSibling;
  screen.debug();
}, 10_000);
