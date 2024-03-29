import { Pie } from "@ant-design/charts";
import { Decimal, Uint64 } from "@cosmjs/math";
import { Typography } from "antd";
import Button from "App/components/Button";
import { DsoHomeParams } from "App/pages/DsoHome";
import { lazy, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useError, useSdk } from "service";
import { MemberStatus } from "utils/oversightCommunity";
import { EscrowResponse, EscrowStatus, TcContractQuerier } from "utils/trustedCircle";

import TooltipWrapper from "../TooltipWrapper";
import { AmountStack, StyledEscrow, TotalEscrowStack, YourEscrowStack } from "./style";

const DepositDsoEscrowModal = lazy(() => import("App/components/DepositDsoEscrowModal"));
const ReturnDsoEscrowModal = lazy(() => import("App/components/ReturnDsoEscrowModal"));
const { Title, Text } = Typography;

export default function DsoEscrow(): JSX.Element {
  const { dsoAddress }: DsoHomeParams = useParams();
  const { handleError } = useError();
  const {
    sdkState: { config, client, address },
  } = useSdk();
  const feeDenom = config.coinMap[config.feeToken].denom;

  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [userEscrow, setUserEscrow] = useState("0");
  const [requiredEscrow, setRequiredEscrow] = useState("0");
  const [exceedingEscrow, setExceedingEscrow] = useState("0");
  const [frozenEscrowDate, setFrozenEscrowDate] = useState<Date>();
  const [totalRequiredEscrow, setTotalRequiredEscrow] = useState(0);
  const [totalPaidEscrow, setTotalPaidEscrow] = useState(0);
  const [pendingEscrow, setPendingEscrow] = useState<string>();
  const [gracePeriod, setGracePeriod] = useState<string>();
  const [membership, setMembership] = useState<MemberStatus>();

  useEffect(() => {
    (async function queryMembership() {
      if (!client || !address) return;

      try {
        const dsoContract = new TcContractQuerier(dsoAddress, client);
        const escrowResponse = await dsoContract.getEscrow(address);

        if (escrowResponse) {
          setMembership(escrowResponse.status);
        } else {
          setMembership(undefined);
        }
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [address, client, dsoAddress, handleError]);

  const refreshEscrows = useCallback(
    async function () {
      if (!client) return;

      try {
        const dsoContract = new TcContractQuerier(dsoAddress, client);

        // get minimum escrow required for this DSO
        const { escrow_amount, escrow_pending } = await dsoContract.getTc();
        const feeDecimals = config.coinMap[config.feeToken].fractionalDigits;

        const requiredEscrowDecimal = Decimal.fromAtomics(escrow_amount, feeDecimals);
        setRequiredEscrow(requiredEscrowDecimal.toString());

        if (address) {
          const escrowResponse = await dsoContract.getEscrow(address);

          if (escrowResponse) {
            const decimals = config.coinMap[config.feeToken].fractionalDigits;
            // get user deposited escrow
            const userEscrowDecimal = Decimal.fromAtomics(escrowResponse.paid, decimals);
            setUserEscrow(userEscrowDecimal.toString());

            // get user exceeding escrow
            const hasExceedingEscrow = userEscrowDecimal.isGreaterThan(requiredEscrowDecimal);
            const exceedingEscrowDecimal = hasExceedingEscrow
              ? userEscrowDecimal.minus(requiredEscrowDecimal)
              : Decimal.fromAtomics("0", decimals);
            setExceedingEscrow(exceedingEscrowDecimal.toString());

            // get frozen escrow date
            const frozenEscrowDate = escrowResponse.status.leaving?.claim_at;
            if (frozenEscrowDate) setFrozenEscrowDate(new Date(frozenEscrowDate * 1000));
          }
        }

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
    animation: false,
    data: data,
    style: { maxWidth: "12.5rem", maxHeight: "14rem" },
    renderer: "svg" as const,
    angleField: "value",
    colorField: "type",
    color: ["var(--color-result-success)", "var(--color-result-failure)"],
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
          color: "var(--color-primary)",
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
        {!membership?.non_voting ? (
          <Title level={2}>Your escrow</Title>
        ) : (
          <Title level={2}>No Escrow Required</Title>
        )}
        {!membership?.non_voting ? (
          <AmountStack gap="s-4">
            <Text>Current paid in:</Text>
            <Text>{`${userEscrow} ${feeDenom}`}</Text>
          </AmountStack>
        ) : null}
        {!membership?.non_voting ? (
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
        ) : null}
        {!frozenEscrowDate || (frozenEscrowDate && frozenEscrowDate < new Date()) ? (
          <Button disabled={!!membership?.non_voting} onClick={() => setDepositModalOpen(true)}>
            Deposit escrow
          </Button>
        ) : null}
        {(!frozenEscrowDate && exceedingEscrow !== "0") ||
        (frozenEscrowDate && frozenEscrowDate < new Date()) ? (
          <Button type="ghost" onClick={() => setReturnModalOpen(true)}>
            Claim escrow
          </Button>
        ) : null}
        {frozenEscrowDate && frozenEscrowDate > new Date() ? (
          <Text>
            Your escrow is frozen until {frozenEscrowDate.toLocaleDateString()} at{" "}
            {frozenEscrowDate.toLocaleTimeString()}{" "}
          </Text>
        ) : null}
      </YourEscrowStack>
      {depositModalOpen ? (
        <DepositDsoEscrowModal
          isModalOpen={depositModalOpen}
          closeModal={() => setDepositModalOpen(false)}
          requiredEscrow={requiredEscrow}
          userEscrow={userEscrow}
          refreshEscrows={refreshEscrows}
        />
      ) : null}
      {returnModalOpen ? (
        <ReturnDsoEscrowModal
          isModalOpen={returnModalOpen}
          closeModal={() => setReturnModalOpen(false)}
          requiredEscrow={requiredEscrow}
          userEscrow={userEscrow}
          exceedingEscrow={exceedingEscrow}
          refreshEscrows={refreshEscrows}
        />
      ) : null}
    </StyledEscrow>
  );
}
