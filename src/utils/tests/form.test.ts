import { getFormItemName } from "../forms";

describe("getFormItemName() func", () => {
  it("empty label", () => {
    expect(getFormItemName("")).toBe("form-item-name-");
  });
  it("label with camelCase", () => {
    expect(getFormItemName("camelCase")).toBe("form-item-name-camelcase");
  });
  it("label with UpperCase", () => {
    expect(getFormItemName("UPPERCASE")).toBe("form-item-name-uppercase");
  });
  it("label without dash", () => {
    expect(getFormItemName("Add dash")).toBe("form-item-name-add-dash");
  });
});
