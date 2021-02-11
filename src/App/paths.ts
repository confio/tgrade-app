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
  cw20Wallet: {
    prefix: "/cw20-wallet",
    params: {
      codeId: "/:codeId?",
      contractAddress: "/:contractAddress",
      allowingAddress: "/:allowingAddress?",
      spenderAddress: "/:spenderAddress",
    },
    tokens: "/tokens",
    tokensAdd: "/tokens/add",
    tokensNew: "/tokens/new",
    send: "/send",
    allowances: "/allowances",
    add: "/add",
    edit: "/edit",
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
