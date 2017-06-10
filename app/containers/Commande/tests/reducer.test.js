import expect from "expect";
import commandeReducer from "../reducer";
import { fromJS } from "immutable";

describe("commandeReducer", () => {
  it("returns the initial state", () => {
    expect(commandeReducer(undefined, {})).toEqual(fromJS({}));
  });
});
