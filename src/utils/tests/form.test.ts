import { getFormItemName } from "../forms";

describe("getFormItemName() func", () => {
  it.skip("empty label", () => {
    expect(getFormItemName("")).toBe("form-item-name-");
  });
  it.skip("label with camelCase", () => {
    expect(getFormItemName("camelCase")).toBe("form-item-name-camelcase");
  });
  it.skip("label with UpperCase", () => {
    expect(getFormItemName("UPPERCASE")).toBe("form-item-name-uppercase");
  });
  it.skip("label without dash", () => {
    expect(getFormItemName("Add dash")).toBe("form-item-name-add-dash");
  });
});
