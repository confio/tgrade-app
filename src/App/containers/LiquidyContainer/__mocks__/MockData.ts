export const columns = [
  {
    title: "Pool",
    dataIndex: "name",
    sorter: {
      // eslint-disable-next-line
      compare: (a: any, b: any) => a.name - b.name,
      multiple: 1,
    },
  },
  {
    title: "Price",
    dataIndex: "chinese",
    sorter: {
      // eslint-disable-next-line
      compare: (a: any, b: any) => a.chinese - b.chinese,
      multiple: 3,
    },
  },
  {
    title: "24h change",
    dataIndex: "math",
    sorter: {
      // eslint-disable-next-line
      compare: (a: any, b: any) => a.math - b.math,
      multiple: 2,
    },
  },
  {
    title: "24h volume",
    dataIndex: "english",
    sorter: {
      // eslint-disable-next-line
      compare: (a: any, b: any) => a.english - b.english,
      multiple: 1,
    },
  },
  {
    title: "Association",
    dataIndex: "association",
    sorter: {
      // eslint-disable-next-line
      compare: (a: any, b: any) => a.association - b.association,
      multiple: 5,
    },
  },
];

export const data = [
  {
    key: "1",
    name: "TGD -> eEUR",
    chinese: 98,
    math: 60,
    english: 70,
    association: "ECB",
  },
  {
    key: "2",
    name: "BTC -> ETH",
    chinese: 98,
    math: 66,
    english: 89,
    association: "none",
  },
  {
    key: "3",
    name: "ETH -> TGD",
    chinese: 98,
    math: 90,
    english: 70,
    association: "IMF",
  },
  {
    key: "4",
    name: "eUSD -> TGD",
    chinese: 88,
    math: 99,
    english: 89,
    association: "FMM",
  },
];
