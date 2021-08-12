export const paths = {
  setup: {
    prefix: "/setup",
    welcome: "/welcome",
    tutorial: "/tutorial",
  },
  logout: "/logout",
  account: {
    prefix: "/account",
    lock: "/lock",
  },
  tmarket: {
    prefix: "/market",
  },
  dso: {
    prefix: "/dso",
    params: {
      dsoAddress: "/:dsoAddress",
      dsoAddressOptional: "/:dsoAddress?",
    },
  },
};
