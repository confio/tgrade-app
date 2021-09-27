export const paths = {
  root: "/",
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
    prefix: "/trustedcircle",
    params: {
      dsoAddress: "/:dsoAddress",
      dsoAddressOptional: "/:dsoAddress?",
    },
  },
  tmarket: {
    prefix: "/tmarket",
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
  documentation: {
    prefix: "/doc",
  },
};
