const chai = require("chai");
const NestedMap = require("../src/NestedMap");
const expect = chai.expect;
const config = require("config");

describe("verify event source", () => {
  it("has bogus event source for testing", () => {
    expect(config.eventSource).to.equal("bogus");
  });
});
