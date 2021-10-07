import publicIp from "public-ip";

async function getAnonIp(version: "v4" | "v6"): Promise<string> {
  const getIp = publicIp[version];
  const ip = await getIp();
  const separator = version === "v4" ? "." : ":";
  const ipArray = ip.split(separator);
  // Replace last group with 0 to preserve anonimity
  const ipArrayPrivate = [...ipArray.slice(0, ipArray.length - 1), 0];
  const ipPrivate = ipArrayPrivate.join(separator);

  return ipPrivate;
}

async function getClientIp(): Promise<string> {
  try {
    const ipv6 = await getAnonIp("v6");
    return ipv6;
  } catch (error) {
    console.error(error);
    try {
      const ipv4 = await getAnonIp("v4");
      return ipv4;
    } catch (error) {
      console.error(error);
      return "";
    }
  }
}

export async function gtagSendWalletInfo(address: string): Promise<void> {
  const ip = await getClientIp();
  const walletInfo = `${new Date().getTime()}|${address}|${ip}`;
  window.gtag("event", "user_data", { wallet_info: walletInfo });
}

export async function gtagLandingAction(
  action: "open_app" | "open_docs" | "book_demo" | "goto_tgrade_website",
): Promise<void> {
  window.gtag("event", "do_landing", { tc_action: action });
}

export async function gtagConnectWallet(type: "keplr" | "ledger", address: string): Promise<void> {
  window.gtag("event", "connect_wallet", { wallet_type: type, wallet_address: address });
}

export async function gtagDsoAction(action: "create_try" | "create_success"): Promise<void> {
  window.gtag("event", "do_trusted_circle", { tc_action: action });
}

export async function gtagProposalAction(action: "whitelist_try" | "whitelist_success"): Promise<void> {
  window.gtag("event", "do_proposal", { proposal_action: action });
}

export async function gtagTokenAction(
  action: "create_token_try" | "create_token_success" | "create_pair_try" | "create_pair_success",
): Promise<void> {
  window.gtag("event", "do_token", { token_action: action });
}

export async function gtagTMarketAction(
  action:
    | "provide_try"
    | "provide_success"
    | "exchange_try"
    | "exchange_success"
    | "withdraw_try"
    | "withdraw_success",
): Promise<void> {
  window.gtag("event", "do_tmarket", { tmarket_action: action });
}
