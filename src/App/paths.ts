export const paths = {
  root: "/",
  privacypolicy: {
    prefix: "/privacypolicy",
  },
  impressum: {
    prefix: "/impressum",
  },
  cookiepolicy: {
    prefix: "/cookiepolicy",
  },
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
  oc: {
    prefix: "/oversightcommunity",
  },
  engagement: {
    prefix: "/engagement",
  },
  validators: {
    prefix: "/validators",
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
    prefix: "/docs",
  },
};
