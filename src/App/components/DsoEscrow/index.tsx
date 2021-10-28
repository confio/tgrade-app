import { Pie } from "@ant-design/charts";
import { Decimal, Uint64 } from "@cosmjs/math";
import { Typography } from "antd";
import Button from "App/components/Button";
import { DsoHomeParams } from "App/pages/DsoHome";
import { lazy, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useError, useSdk } from "service";
import { nativeCoinToDisplay } from "utils/currency";
import { DsoContractQuerier, EscrowResponse, EscrowStatus } from "utils/dso";

import TooltipWrapper from "../TooltipWrapper";
import { AmountStack, StyledEscrow, TotalEscrowStack, YourEscrowStack } from "./style";

const DepositDsoEscrowModal = lazy(() => import("App/components/DepositDsoEscrowModal"));
const { Title, Text } = Typography;

export default function DsoEscrow(): JSX.Element {
  const { dsoAddress }: DsoHomeParams = useParams();
  const { handleError } = useError();
  const {
    sdkState: { config, client, address },
  } = useSdk();
  const feeDenom = config.coinMap[config.feeToken].denom;

  const [modalOpen, setModalOpen] = useState(false);

  const [userEscrow, setUserEscrow] = useState("0");
  const [requiredEscrow, setRequiredEscrow] = useState("0");
  const [totalRequiredEscrow, setTotalRequiredEscrow] = useState(0);
  const [totalPaidEscrow, setTotalPaidEscrow] = useState(0);
  const [pendingEscrow, setPendingEscrow] = useState<string>();
  const [gracePeriod, setGracePeriod] = useState<string>();

  const refreshEscrows = useCallback(
    async function () {
      if (!client) return;

      try {
        const dsoContract = new DsoContractQuerier(dsoAddress, client);

        // get user deposited escrow
        if (address) {
          const escrowResponse = await dsoContract.getEscrow(address);

          if (escrowResponse) {
            const userEscrow = nativeCoinToDisplay(
              { denom: config.feeToken, amount: escrowResponse.paid },
              config.coinMap,
            ).amount;
            setUserEscrow(userEscrow);
          }
        }

        // get minimum escrow required for this DSO
        const { escrow_amount, escrow_pending } = await dsoContract.getDso();
        const feeDecimals = config.coinMap[config.feeToken].fractionalDigits;

        const requiredEscrowDecimal = Decimal.fromAtomics(escrow_amount, feeDecimals);
        setRequiredEscrow(requiredEscrowDecimal.toString());

        // get pending escrow and grace period if any
        if (escrow_pending) {
          const pendingEscrowAmount = Decimal.fromAtomics(escrow_pending.amount, feeDecimals).toString();
          setPendingEscrow(pendingEscrowAmount);

          const gracePeriod = new Date(escrow_pending.grace_ends_at * 1000).toLocaleString();
          setGracePeriod(gracePeriod);
        }

        // get member escrows to calculate total required and total paid
        const members = await dsoContract.getAllMembers();

        const memberEscrowPromises = members.map(({ addr }) => dsoContract.getEscrow(addr));
        const memberEscrowResults = await Promise.allSettled(memberEscrowPromises);
        const memberEscrowStatuses = memberEscrowResults
          .filter((res): res is PromiseFulfilledResult<EscrowResponse> => res.status === "fulfilled")
          .filter((res): res is PromiseFulfilledResult<EscrowStatus> => res.value !== null)
          .map((res) => res.value);

        // get total required
        let numMembersExpectedToDeposit = 0;
        for (const escrow of memberEscrowStatuses) {
          if (!escrow.status.non_voting) {
            ++numMembersExpectedToDeposit;
          }
        }
        const totalRequiredEscrow = requiredEscrowDecimal
          .multiply(Uint64.fromNumber(numMembersExpectedToDeposit))
          .toFloatApproximation();
        setTotalRequiredEscrow(totalRequiredEscrow);

        // get total paid
        let totalPaidEscrow = Decimal.fromAtomics("0", feeDecimals);
        for (const escrow of memberEscrowStatuses) {
          const decimalEscrow = Decimal.fromAtomics(escrow.paid, feeDecimals);
          totalPaidEscrow = totalPaidEscrow.plus(decimalEscrow);
        }
        setTotalPaidEscrow(totalPaidEscrow.toFloatApproximation());
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    },
    [address, client, config.coinMap, config.feeToken, dsoAddress, handleError],
  );

  useEffect(() => {
    refreshEscrows();
  }, [refreshEscrows]);

  const data = [
    {
      type: "current paid in",
      value: totalPaidEscrow,
    },
    {
      type: "needed",
      value: totalRequiredEscrow < totalPaidEscrow ? 0 : totalRequiredEscrow - totalPaidEscrow,
    },
  ];

  const pieConfig = {
    data: data,
    style: { maxWidth: "12.5rem", maxHeight: "14rem" },
    renderer: "svg" as const,
    angleField: "value",
    colorField: "type",
    color: ["hsl(180, 88%, 37%)", "hsl(218, 15%, 59%)"],
    radius: 1,
    innerRadius: 0.75,
    legend: {
      layout: "horizontal" as const,
      position: "bottom" as const,
    },
    meta: {
      value: {
        formatter: (value: number) => {
          if (totalRequiredEscrow < totalPaidEscrow) {
            if (value === 0) return totalRequiredEscrow;
            return totalPaidEscrow;
          }

          if (value === totalPaidEscrow && value !== totalRequiredEscrow) {
            return totalPaidEscrow;
          }

          return totalRequiredEscrow;
        },
      },
    },
    label: {
      type: "inner",
      formatter: () => "",
    },
    statistic: {
      title: false,
      content: {
        style: {
          color: "hsl(180, 88%, 37%)",
          fontFamily: "var(--ff-text)",
          fontWeight: 500,
        },
        content: `<div><p>${totalPaidEscrow}</p><p>${feeDenom}</p></div>`,
      },
    },
  };

  return (
    <StyledEscrow>
      <TotalEscrowStack>
        <Title level={2}>Total escrow</Title>
        <Pie {...pieConfig} />
      </TotalEscrowStack>
      <YourEscrowStack gap="s1">
        <Title level={2}>Your escrow</Title>
        <AmountStack gap="s-4">
          <Text>Current paid in:</Text>
          <Text>{`${userEscrow} ${feeDenom}`}</Text>
        </AmountStack>
        <AmountStack gap="s-4">
          <Text>Needed to get voting rights:</Text>
          {pendingEscrow ? (
            <TooltipWrapper
              title={`The current minimum escrow is ${requiredEscrow} ${feeDenom}, but ${pendingEscrow} ${feeDenom} will be needed after ${gracePeriod} in order to have voting rights`}
            >
              <Text>{`${pendingEscrow} ${feeDenom}`}</Text>
            </TooltipWrapper>
          ) : (
            <Text>{`${requiredEscrow} ${feeDenom}`}</Text>
          )}
        </AmountStack>
        <Button onClick={() => setModalOpen(true)}>Deposit escrow</Button>
      </YourEscrowStack>
      {modalOpen ? (
        <DepositDsoEscrowModal
          isModalOpen={modalOpen}
          closeModal={() => setModalOpen(false)}
          requiredEscrow={requiredEscrow}
          userEscrow={userEscrow}
          refreshEscrows={refreshEscrows}
        />
      ) : null}
    </StyledEscrow>
  );
}
