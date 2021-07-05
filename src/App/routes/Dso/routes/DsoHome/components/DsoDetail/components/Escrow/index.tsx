import { Pie } from "@ant-design/charts";
import { Decimal, Uint64 } from "@cosmjs/math";
import { Typography } from "antd";
import { Button } from "App/components/form";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useError, useSdk } from "service";
import { nativeCoinToDisplay } from "utils/currency";
import { DsoContract, EscrowResponse, EscrowStatus } from "utils/dso";
import { DsoHomeParams } from "../../../..";
import DepositEscrowModal from "./components/DepositEscrowModal";
import { StyledEscrow, TotalEscrowStack, YourEscrowStack } from "./style";

const { Title, Text } = Typography;

export default function Escrow(): JSX.Element {
  const { dsoAddress }: DsoHomeParams = useParams();
  const { handleError } = useError();
  const {
    sdkState: { signingClient, config, address },
  } = useSdk();
  const feeDenom = config.coinMap[config.feeToken].denom;

  const [modalOpen, setModalOpen] = useState(false);

  const [userEscrow, setUserEscrow] = useState("");
  const [requiredEscrow, setRequiredEscrow] = useState("");
  const [totalRequiredEscrow, setTotalRequiredEscrow] = useState(0);
  const [totalPaidEscrow, setTotalPaidEscrow] = useState(0);

  const refreshEscrows = useCallback(
    async function () {
      try {
        // get user deposited escrow
        const escrowResponse = await DsoContract(signingClient).use(dsoAddress).escrow(address);

        if (escrowResponse) {
          const userEscrow = nativeCoinToDisplay(
            { denom: config.feeToken, amount: escrowResponse.paid },
            config.coinMap,
          ).amount;
          setUserEscrow(userEscrow);
        }

        // get minimum escrow required for this DSO
        const { escrow_amount } = await DsoContract(signingClient).use(dsoAddress).dso();
        const feeDecimals = config.coinMap[config.feeToken].fractionalDigits;

        const requiredEscrowDecimal = Decimal.fromAtomics(escrow_amount, feeDecimals);
        setRequiredEscrow(requiredEscrowDecimal.toString());

        // get member escrows to calculate total required and total paid
        const members = await DsoContract(signingClient).use(dsoAddress).listAllMembers();

        const memberEscrowPromises = members.map(({ addr }) =>
          DsoContract(signingClient).use(dsoAddress).escrow(addr),
        );
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
        handleError(error);
      }
    },
    [address, config.coinMap, config.feeToken, dsoAddress, handleError, signingClient],
  );

  useEffect(() => {
    refreshEscrows();
  }, [refreshEscrows]);

  const data = [
    {
      type: "current paid",
      value: totalPaidEscrow,
    },
    {
      type: "needed",
      value: totalRequiredEscrow < totalPaidEscrow ? 0 : totalRequiredEscrow - totalPaidEscrow,
    },
  ];

  const pieConfig = {
    data: data,
    autoFit: true,
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
        },
        content: totalPaidEscrow + " TGD",
      },
    },
  };

  return (
    <StyledEscrow>
      <TotalEscrowStack>
        <Title level={2}>Total escrow</Title>
        <Pie {...pieConfig} />
      </TotalEscrowStack>
      <YourEscrowStack>
        <Title level={2}>Your escrow</Title>
        <Text>current paid in:</Text>
        <Text>{`${userEscrow} ${feeDenom}`}</Text>
        <Text>needed to get voting rights:</Text>
        <Text>{`${requiredEscrow} ${feeDenom}`}</Text>
        <Button onClick={() => setModalOpen(true)}>Deposit escrow</Button>
      </YourEscrowStack>
      {modalOpen ? (
        <DepositEscrowModal
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
