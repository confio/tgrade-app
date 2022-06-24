import { anOldHope, CopyBlock } from "react-code-blocks";
import { isMobile } from "react-device-detect";

import {
  ContentWrapper,
  PageWrapper,
  StyledItemGroup,
  StyledMenu,
  StyledMenuItem,
  StyledSubmenu,
  Subtitle,
  Text,
  Title,
} from "./style";

export default function DocumentationPage(): JSX.Element | null {
  return (
    <PageWrapper>
      {isMobile ? null : (
        <StyledMenu defaultSelectedKeys={["1"]} defaultOpenKeys={["sub1"]} mode="inline">
          <StyledSubmenu key="sub1" icon={undefined} title="Balances">
            <StyledItemGroup key="g1">
              <StyledMenuItem key="1">
                <a href="#Get_total">Get total</a>
              </StyledMenuItem>
              <StyledMenuItem key="2">
                <a href="#Get_vesting_detail">Get vesting detail</a>
              </StyledMenuItem>
              <StyledMenuItem key="3">
                <a href="#Get_Staking_address_1">Get Staking address</a>
              </StyledMenuItem>
              <StyledMenuItem key="4">
                <a href="#Stake_liquid">Stake liquid</a>
              </StyledMenuItem>
              <StyledMenuItem key="5">
                <a href="#Stake_vesting">Stake vesting</a>
              </StyledMenuItem>
            </StyledItemGroup>
          </StyledSubmenu>
          <StyledSubmenu key="sub2" icon={undefined} title="Proof of Engagement">
            <StyledItemGroup key="g2">
              <StyledMenuItem key="6">
                <a href="#Get_Engagement_address">Get Engagement address</a>
              </StyledMenuItem>
              <StyledMenuItem key="7">
                <a href="#List_Engagement_members">List Engagement members</a>
              </StyledMenuItem>
              <StyledMenuItem key="8">
                <a href="#Query_member_EP">Query member EP</a>
              </StyledMenuItem>
              <StyledMenuItem key="9">
                <a href="#Get_Staking_address_2">Get Staking address</a>
              </StyledMenuItem>
              <StyledMenuItem key="10">
                <a href="#List_Staking_members">List Staking members</a>
              </StyledMenuItem>
              <StyledMenuItem key="11">
                <a href="#Query_member_staking">Query member staking</a>
              </StyledMenuItem>
            </StyledItemGroup>
          </StyledSubmenu>
        </StyledMenu>
      )}
      <ContentWrapper isMobile={isMobile}>
        <Title style={{ margin: 0 }}>Balances</Title>
        <Subtitle id="Get_total">Get total</Subtitle>
        <Text>Total balances can be obtained with:</Text>
        <CopyBlock
          text={`
tgrade query bank balances <address> --node=<node_url>
          `}
          language={"shell"}
          showLineNumbers={false}
          theme={anOldHope}
          wrapLines
        />
        <Text>Example:</Text>
        <CopyBlock
          text={`
$ tgrade query bank balances tgrade1kwc9ds5t03xkhx49qwkwq3z2tqzhxxqtrwv780 --node=https://rpc.my-node.tgrade.confio.run:443
balances:
- amount: "1"
  denom: ibc/0D4A2460893BC1C19DB97ED8CD13D10D0F1764819FB741C470C70FBC470D7A3D
- amount: "13"
  denom: ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9
- amount: "5984006739433"
  denom: utgd
pagination:
  next_key: null
  total: "0"
$
          `}
          language={"shell"}
          showLineNumbers={false}
          theme={anOldHope}
          wrapLines
        />
        <Subtitle id="Get_vesting_detail">Get vesting detail</Subtitle>
        <Text>If the account is a vesting account, the vesting amounts detail can be obtained with:</Text>
        <CopyBlock
          text={`
tgrade query account <address> --node=<node_url>
          `}
          language={"shell"}
          showLineNumbers={false}
          theme={anOldHope}
          wrapLines
        />
        <Text>Example:</Text>
        <CopyBlock
          text={`
$ tgrade query bank balances tgrade10wx3tmjhpepnul0s6ssqqr0rdr6uprs6j2rkqy --node=https://rpc.my-node.tgrade.confio.run:443
balances:
- amount: "99990818284"
  denom: utgd
pagination:
  next_key: null
  total: "0"
$ tgrade query account tgrade10wx3tmjhpepnul0s6ssqqr0rdr6uprs6j2rkqy --node=https://rpc.my-node.tgrade.confio.run:443
'@type': /cosmos.vesting.v1beta1.DelayedVestingAccount
base_vesting_account:
  base_account:
    account_number: "0"
    address: tgrade10wx3tmjhpepnul0s6ssqqr0rdr6uprs6j2rkqy
    pub_key:
      '@type': /cosmos.crypto.secp256k1.PubKey
      key: AvYORgF4iN1kr30qdb26VYTFMYoULcJKcKpIgBXaHmoV
    sequence: "84"
  delegated_free: []
  delegated_vesting:
  - amount: "900000000000"
    denom: utgd
  end_time: "1702818618"
  original_vesting:
  - amount: "900000000000"
    denom: utgd
$
          `}
          language={"shell"}
          showLineNumbers={false}
          theme={anOldHope}
          wrapLines
        />
        <Text>
          Subtracting the vesting amount (900000000000) minus the delegated vesting (900000000000) plus the
          delegated free amount from the total balance (99990818284), we can then obtain the liquid amount
          (99990818284 - (900000000000 - 900000000000+0) = 99990818284).
        </Text>
        <Subtitle id="Get_Staking_address_1">Get Staking address</Subtitle>
        <Text>
          To stake liquid or vesting amounts, a staking message has to be sent to the tg4-stake contract:
        </Text>
        <CopyBlock
          text={`
$ stakeAddr=$(trade q poe contract-address STAKING -o json --node="$nodeUrl" | jq -re ".address")
$ echo $stakeAddr
tgrade17p9rzwnnfxcjp32un9ug7yhhzgtkhvl9jfksztgw5uh69wac2pgsmsjtzp
$
          `}
          language={"shell"}
          showLineNumbers={false}
          theme={anOldHope}
          wrapLines
        />
        <Subtitle id="Stake_liquid">Stake liquid</Subtitle>
        <Text>
          This will stake liquid {"<liquid_amount>"} tokens associated with {"<my_key>"} into the staking
          contract, and no vesting tokens:
        </Text>
        <CopyBlock
          text={`
tgrade tx wasm execute <staking_contract_address> "{ \\"bond\\": { } }" --amount <liquid_amount> --from <my_key> <options>
          `}
          language={"shell"}
          showLineNumbers={false}
          theme={anOldHope}
          wrapLines
        />
        <Text>Example:</Text>
        <CopyBlock
          text={`
$ tgrade tx wasm execute "$stakeAddr" "{ \\"bond\\": {} }" --amount 1000000utgd --from $myKey --gas auto --gas-prices=0.1utgd --gas-adjustment=1.3 -y --chain-id="$chainId" --node="$nodeUrl" -b block -o json "$keyringBackend" | jq .
.
gas estimate: 104661
{
  "height": "89864",
  "txhash": "F06E91EE2C41D7513396D03E495DC38CC55A39C2F74957EA7E7ECC78D65861F4",
  "codespace": "",
  "code": 0,
  "data": "0A260A242F636F736D7761736D2E7761736D2E76312E4D736745786563757465436F6E7472616374",
...
$
          `}
          language={"shell"}
          showLineNumbers={false}
          theme={anOldHope}
          wrapLines
        />
        <Text>This stakes 1 liquid and 0 vesting TGD into the staking contract.</Text>
        <Subtitle id="Stake_vesting">Stake vesting</Subtitle>
        <Text>This will stake {"<vesting_amount>"} vesting tokens into the staking contract:</Text>
        <CopyBlock
          text={`
tgrade tx wasm execute <staking_contract_address> "{ \\"bond\\": { \\"vesting_tokens\\": { \\"denom\\": \\"utgd\\", \\"amount\\": \\"<vesting_amount>\\" } } }" --amount 0utgd --from <my_key> <options>
          `}
          language={"shell"}
          showLineNumbers={false}
          theme={anOldHope}
          wrapLines
        />
        <Text>Example:</Text>
        <CopyBlock
          text={`
$ tgrade tx wasm execute "$stakeAddr" "{ \\"bond\\": { \\"vesting_tokens\\": { \\"denom\\": \\"utgd\\", \\"amount\\": \\"1000000\\" } } }" --amount 0utgd --from $myKey --gas auto --gas-prices=0.1utgd --gas-adjustment=1.3 -y --chain-id="$chainId" --node="$nodeUrl" -b block -o json "$keyringBackend" | jq .
gas estimate: 220715
{
  "height": "90747",
  "txhash": "66FEB5604FD56807FA776F79E4CF4AB738A4769115C5B87CCD93D167275AF857",
  "codespace": "",
  "code": 0,
  "data": "0A260A242F636F736D7761736D2E7761736D2E76312E4D736745786563757465436F6E7472616374",
...
$
          `}
          language={"shell"}
          showLineNumbers={false}
          theme={anOldHope}
          wrapLines
        />
        <Text>This then stakes 0 liquid and 1 vesting TGD into the staking contract.</Text>
        <Text>Both variants can be combined, staking both liquid and vesting amounts at the same time.</Text>
        <Title>Proof of Engagement</Title>
        <Subtitle id="Get_Engagement_address">Get Engagement address</Subtitle>
        <Text>To query engagement, a engagement message has to be sent to the tg4-engagement contract:</Text>
        <CopyBlock
          text={`
$ engagementAddr=$(tgrade q poe contract-address ENGAGEMENT -o json --node="$nodeUrl" | jq -re ".address")
$ echo $engagementAddr
tgrade14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s07fvfr
$
          `}
          language={"shell"}
          showLineNumbers={false}
          theme={anOldHope}
          wrapLines
        />
        <Subtitle id="List_Engagement_members">List Engagement members</Subtitle>
        <Text>With this query you can list the engagement members:</Text>
        <CopyBlock
          text={`
tgrade query wasm contract-state smart <engagement_address> "{\\"list_members\\": {} }" -o json --node=<node_url> | jq .
  `}
          language={"shell"}
          showLineNumbers={false}
          theme={anOldHope}
          wrapLines
        />
        <Text>Example:</Text>
        <CopyBlock
          text={`
$ tgrade query wasm contract-state smart $engagementAddr "{\\"list_members\\": {} }" -o json --node="$nodeUrl"
{
  "data": {
    "members": [
      {
        "addr": "tgrade10wx3tmjhpepnul0s6ssqqr0rdr6uprs6j2rkqy",
        "points": 1,
        "start_height": null
      },
      {
        "addr": "tgrade16h7afvwlgxup5cajj368azjju786jpr7wfzh3y",
        "points": 1,
        "start_height": null
      },
      {
        "addr": "tgrade1dksv75fj249qarl2nncsssqjsepn4ewhy9eqr4",
        "points": 1,
        "start_height": null
      },
      {
        "addr": "tgrade1p3xrhk4kcqeqck6pymafny2c7uqfysul3nr5rw",
        "points": 2,
        "start_height": null
      },
      {
        "addr": "tgrade1y7jun5ddt2n5j8t3h9c4qxturcrdrhhuyc0clt",
        "points": 2,
        "start_height": null
      }
    ]
  }
}
$
  `}
          language={"shell"}
          showLineNumbers={false}
          theme={anOldHope}
          wrapLines
        />
        <Subtitle id="Query_member_EP">Query member EP</Subtitle>
        <Text>With this query you can get a member's engagement points:</Text>
        <CopyBlock
          text={`
tgrade query wasm contract-state smart <engagement_address> "{ \\"member\\": { \\"addr\\": \\"<member_addr>\\" } }" -o json --node=<node_url> | jq .
  `}
          language={"shell"}
          showLineNumbers={false}
          theme={anOldHope}
          wrapLines
        />
        <Text>Example:</Text>
        <CopyBlock
          text={`
$ tgrade query wasm contract-state smart $engagementAddr "{ \\"member\\": { \\"addr\\": \\"tgrade16h7afvwlgxup5cajj368azjju786jpr7wfzh3y\\" } }" -o json --node="$nodeUrl" | jq .
{
  "data": {
    "points": 1,
    "start_height": null
  }
}
$
  `}
          language={"shell"}
          showLineNumbers={false}
          theme={anOldHope}
          wrapLines
        />

        <Subtitle id="Get_Staking_address_2">Get Staking address</Subtitle>
        <Text>In the same way, the staked amounts in the staking contract can be listed and queried:</Text>
        <CopyBlock
          text={`
$ stakeAddr=$(trade q poe contract-address STAKING -o json --node="$nodeUrl" | jq -re ".address")
$ echo $stakeAddr
tgrade17p9rzwnnfxcjp32un9ug7yhhzgtkhvl9jfksztgw5uh69wac2pgsmsjtzp
$
          `}
          language={"shell"}
          showLineNumbers={false}
          theme={anOldHope}
          wrapLines
        />
        <Subtitle id="List_Staking_members">List Staking members</Subtitle>
        <Text>With this query you can list the staking contract members:</Text>
        <CopyBlock
          text={`
tgrade query wasm contract-state smart <staking_address> "{\\"list_members\\": {} }" -o json --node=<node_url> | jq .
  `}
          language={"shell"}
          showLineNumbers={false}
          theme={anOldHope}
          wrapLines
        />
        <Text>Example:</Text>
        <CopyBlock
          text={`
$ tgrade query wasm contract-state smart $stakeAddr "{\\"list_members\\": {} }" -o json --node="$nodeUrl" | jq .
{
  "data": {
    "members": [
      {
        "addr": "tgrade10wx3tmjhpepnul0s6ssqqr0rdr6uprs6j2rkqy",
        "points": 900001,
        "start_height": null
      },
      {
        "addr": "tgrade16h7afvwlgxup5cajj368azjju786jpr7wfzh3y",
        "points": 888905,
        "start_height": null
      },
      {
        "addr": "tgrade1dksv75fj249qarl2nncsssqjsepn4ewhy9eqr4",
        "points": 900000,
        "start_height": null
      },
      {
        "addr": "tgrade1y7jun5ddt2n5j8t3h9c4qxturcrdrhhuyc0clt",
        "points": 900000,
        "start_height": null
      }
    ]
  }
}
$
  `}
          language={"shell"}
          showLineNumbers={false}
          theme={anOldHope}
          wrapLines
        />
        <Subtitle id="Query_member_staking">Query member staking</Subtitle>
        <Text>With this query you can get a member's staking:</Text>
        <CopyBlock
          text={`
tgrade query wasm contract-state smart <staking_address> "{\\"staked\\": { \\"address\\": \\"<member_addr>\\"} }" -o json --node="$nodeUrl" | jq .
  `}
          language={"shell"}
          showLineNumbers={false}
          theme={anOldHope}
          wrapLines
        />
        <Text>Example:</Text>
        <CopyBlock
          text={`
tgrade query wasm contract-state smart $stakeAddr "{\\"staked\\": { \\"address\\": \\"tgrade16h7afvwlgxup5cajj368azjju786jpr7wfzh3y\\"} }" -o json --node="$nodeUrl" | jq .
{
  "data": {
    "liquid": {
      "denom": "utgd",
      "amount": "10000000"
    },
    "vesting": {
      "denom": "utgd",
      "amount": "888895000000"
    }
  }
}
$
  `}
          language={"shell"}
          showLineNumbers={false}
          theme={anOldHope}
          wrapLines
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
