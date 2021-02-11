export const paths = {
  login: "/login",
  logout: "/logout",
  operationResult: "/operation-result",
  account: "/account",
  wallet: {
    prefix: "/wallet",
    params: {
      tokenName: "/:tokenName",
    },
    tokens: "/tokens",
  },
  staking: {
    prefix: "/staking",
    params: {
      validatorAddress: "/:validatorAddress",
    },
    validators: "/validators",
    delegate: "/delegate",
    undelegate: "/undelegate",
    rewards: "/rewards",
  },
};
