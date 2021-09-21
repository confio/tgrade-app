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
    console.log(error);
    try {
      const ipv4 = await getAnonIp("v4");
      return ipv4;
    } catch (error) {
      console.log(error);
      return "";
    }
  }
}

export async function gtagSendWalletInfo(address: string): Promise<void> {
  const ip = await getClientIp();
  const walletInfo = `${new Date().getTime()}|${address}|${ip}`;
  window.gtag("event", "user_data", { wallet_info: walletInfo });
}
