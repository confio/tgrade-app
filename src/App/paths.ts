export const paths = {
  root: "/",
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
  ap: {
    prefix: "/arbiterpool",
  },
  cpool: {
    prefix: "/communitypool",
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
