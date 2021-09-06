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
  dso: {
    prefix: "/dso",
    params: {
      dsoAddress: "/:dsoAddress",
      dsoAddressOptional: "/:dsoAddress?",
    },
  },
  tmarket: {
    prefix: "/market",
    home: {
      prefix: "/home",
    },
    exchange: {
      prefix: "/exchange",
      result: "/result",
    },
    provide: {
      prefix: "/provide",
      result: "/result",
    },
    withdraw: {
      prefix: "/withdraw",
      result: "/result",
    },
  },
};
