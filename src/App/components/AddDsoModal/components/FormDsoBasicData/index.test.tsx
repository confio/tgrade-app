import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import FormDsoBasicData from ".";

it("renders and submits FormDsoBasicData", async () => {
  const handleSubmit = jest.fn();
  const goToAddExistingDso = jest.fn();

  render(
    <FormDsoBasicData
      handleSubmit={handleSubmit}
      goToAddExistingDso={goToAddExistingDso}
      dsoName=""
      votingDuration="14"
      quorum="1"
      threshold="50.01"
      allowEndEarly={true}
    />,
  );

  userEvent.type(screen.getByLabelText(/trusted circle name/i), "Trusted Circle 1");
  userEvent.clear(screen.getByLabelText(/voting duration/i));
  userEvent.type(screen.getByLabelText(/voting duration/i), "19");
  userEvent.clear(screen.getByLabelText(/quorum/i));
  userEvent.type(screen.getByLabelText(/quorum/i), "30");
  userEvent.clear(screen.getByLabelText(/threshold/i));
  userEvent.type(screen.getByLabelText(/threshold/i), "51");
  userEvent.click(screen.getByLabelText(/allow voting to end early/i));

  userEvent.click(screen.getByRole("button", { name: /next/i }));

  await waitFor(() =>
    expect(handleSubmit).toHaveBeenCalledWith({
      dsoName: "Trusted Circle 1",
      votingDuration: "19",
      quorum: "30",
      threshold: "51",
      allowEndEarly: false,
    }),
  );
});
