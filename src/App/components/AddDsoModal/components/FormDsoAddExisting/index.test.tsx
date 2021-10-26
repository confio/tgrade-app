import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormDsoAddExisting from ".";

it("renders and submits FormDsoAddExisting", async () => {
  const handleSubmit = jest.fn();
  const goToCreateDso = jest.fn();

  render(
    <FormDsoAddExisting addressPrefix="tgrade" handleSubmit={handleSubmit} goToCreateDso={goToCreateDso} />,
  );

  userEvent.type(
    screen.getByLabelText(/trusted circle address/i),
    "tgrade1uuy629yfuw2mf383t33x0jk2qwtf6rvv4dhmxs",
  );
  userEvent.click(screen.getByRole("button", { name: /enter/i }));

  await waitFor(() =>
    expect(handleSubmit).toHaveBeenCalledWith({
      dsoAddress: "tgrade1uuy629yfuw2mf383t33x0jk2qwtf6rvv4dhmxs",
    }),
  );
});
