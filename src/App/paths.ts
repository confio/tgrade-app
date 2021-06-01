export const paths = {
  setup: {
    prefix: "/setup",
    welcome: "/welcome",
    tutorial: "/tutorial",
  },
  login: {
    prefix: "/login",
    unlock: "/unlock",
    import: "/import",
  },
  logout: "/logout",
  operationResult: "/operation-result",
  account: {
    prefix: "/account",
    lock: "/lock",
  },
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
    tokensAddExisting: "/tokens/add/existing",
    tokensAddNew: "/tokens/add/new",
    send: "/send",
    allowances: "/allowances",
    add: "/add",
    edit: "/edit",
    mint: "/mint",
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
  dso: {
    prefix: "/dso",
    params: {
      dsoAddress: "/:dsoAddress",
    },
  },
};
