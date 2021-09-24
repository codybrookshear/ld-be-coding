// test internal class directly

const chai = require("chai");
const NestedMap = require("../src/NestedMap");
const expect = chai.expect;
const app = require("../src/server");

describe("verify stores correct values", () => {
  let nestedMap = new NestedMap();

  it("is properly set up", () => {
    let outerKeys = nestedMap.getOuterKeys();
    expect(outerKeys.wrapper.length).to.equal(0);

    let innerValues = nestedMap.getInnerValues();
    expect(innerValues.average).to.equal(0);
    expect(innerValues.outerKey).to.equal(undefined);
    expect(innerValues.arr.length).to.equal(0);
  });

  it("holds 1 value correctly", () => {
    nestedMap.set("o", "i", 1);

    let outerKeys = nestedMap.getOuterKeys();
    expect(outerKeys.wrapper.length).to.equal(1);
    expect(outerKeys.wrapper[0].outerKey).to.equal("o");

    let innerValues = nestedMap.getInnerValues("o");
    expect(innerValues.average).to.equal(1);
    expect(innerValues.outerKey).to.equal("o");
    expect(innerValues.arr.length).to.equal(1);
    expect(innerValues.arr[0].key).to.equal("i");
    expect(innerValues.arr[0].value).to.equal(1);
  });

  it("holds 2 values correctly, at same outer key", () => {
    nestedMap.set("o", "i2", 2);

    let outerKeys = nestedMap.getOuterKeys();
    expect(outerKeys.wrapper.length).to.equal(1);
    expect(outerKeys.wrapper[0].outerKey).to.equal("o");

    let innerValues = nestedMap.getInnerValues("o");
    expect(innerValues.average).to.equal(1.5); // (1 + 2) / 2
    expect(innerValues.outerKey).to.equal("o");

    expect(innerValues.arr.length).to.equal(2);
    expect(innerValues.arr[0].key).to.equal("i");
    expect(innerValues.arr[0].value).to.equal(1);
    expect(innerValues.arr[1].key).to.equal("i2");
    expect(innerValues.arr[1].value).to.equal(2);
  });

  it("and another value at a different outer key", () => {
    nestedMap.set("o2", "i", 3);

    let outerKeys = nestedMap.getOuterKeys();
    expect(outerKeys.wrapper.length).to.equal(2);
    expect(outerKeys.wrapper[0].outerKey).to.equal("o");
    expect(outerKeys.wrapper[1].outerKey).to.equal("o2");

    // expect same as last test for o
    let innerValues = nestedMap.getInnerValues("o");
    expect(innerValues.average).to.equal(1.5); // (1 + 2) / 2
    expect(innerValues.outerKey).to.equal("o");
    expect(innerValues.arr.length).to.equal(2);
    expect(innerValues.arr[0].key).to.equal("i");
    expect(innerValues.arr[0].value).to.equal(1);
    expect(innerValues.arr[1].key).to.equal("i2");
    expect(innerValues.arr[1].value).to.equal(2);

    // now verify o2
    innerValues = nestedMap.getInnerValues("o2");
    expect(innerValues.average).to.equal(3);
    expect(innerValues.outerKey).to.equal("o2");
    expect(innerValues.arr.length).to.equal(1);
    expect(innerValues.arr[0].key).to.equal("i");
    expect(innerValues.arr[0].value).to.equal(3);
  });

  // TODO test map with custom labels
  it("uses constructor custom labels correctly", () => {
    nestedMap = new NestedMap("a", "b", "c", "d", "e");
    nestedMap.set("o", "i", 1);

    let outerKeys = nestedMap.getOuterKeys();
    expect(outerKeys.a.length).to.equal(1);
    expect(outerKeys.a[0].b).to.equal("o");

    let innerValues = nestedMap.getInnerValues("o");
    expect(innerValues.average).to.equal(1);
    expect(innerValues.b).to.equal("o");
    expect(innerValues.c.length).to.equal(1);
    expect(innerValues.c[0].d).to.equal("i");
    expect(innerValues.c[0].e).to.equal(1);
  });

  it("ignores non-numeric values", () => {
    nestedMap = new NestedMap();
    nestedMap.set("o", "i", "A");
    let outerKeys = nestedMap.getOuterKeys();
    expect(outerKeys.wrapper.length).to.equal(0);
  });
  // TODO see what happens if last value isn't a number!
});
