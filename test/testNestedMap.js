// test internal class directly

const chai = require("chai");
const NestedMap = require("../src/NestedMap");
const expect = chai.expect;
const app = require("../src/server");

describe("verify NestedMap class", () => {
  it("is properly set up", () => {
    let nestedMap = new NestedMap();
    let outerKeys = nestedMap.getOuterKeys();
    expect(outerKeys.wrapper.length).to.equal(0);

    let innerValues = nestedMap.getInnerValues();
    expect(innerValues.average).to.equal(0);
    expect(innerValues.arr.length).to.equal(0);
  });

  it("holds 1 value correctly", () => {
    let nestedMap = new NestedMap();
    nestedMap.set("o", 123, 1);

    let outerKeys = nestedMap.getOuterKeys();
    expect(outerKeys.wrapper.length).to.equal(1);
    expect(outerKeys.wrapper[0].outerKey).to.equal("o");

    let innerValues = nestedMap.getInnerValues("o");
    expect(innerValues.average).to.equal(1);
    expect(innerValues.outerKey).to.equal("o");
    expect(innerValues.arr.length).to.equal(1);
    expect(innerValues.arr[0].key).to.equal(123);
    expect(innerValues.arr[0].value).to.equal(1);
  });

  it("holds 2 values correctly, at same outer key", () => {
    let nestedMap = new NestedMap();
    nestedMap.set("o", 123, 1);
    nestedMap.set("o", 124, 0.5);

    let outerKeys = nestedMap.getOuterKeys();
    expect(outerKeys.wrapper.length).to.equal(1);
    expect(outerKeys.wrapper[0].outerKey).to.equal("o");

    let innerValues = nestedMap.getInnerValues("o");
    expect(innerValues.average).to.equal(0.75);
    expect(innerValues.outerKey).to.equal("o");

    expect(innerValues.arr.length).to.equal(2);
    expect(innerValues.arr[0].key).to.equal(123);
    expect(innerValues.arr[0].value).to.equal(1);
    expect(innerValues.arr[1].key).to.equal(124);
    expect(innerValues.arr[1].value).to.equal(0.5);
  });

  it("and another value at a different outer key", () => {
    let nestedMap = new NestedMap();
    nestedMap.set("o", 123, 1);
    nestedMap.set("o", 124, 0.5);
    nestedMap.set("o2", 125, 0.8);

    let outerKeys = nestedMap.getOuterKeys();
    expect(outerKeys.wrapper.length).to.equal(2);
    expect(outerKeys.wrapper[0].outerKey).to.equal("o");
    expect(outerKeys.wrapper[1].outerKey).to.equal("o2");

    // expect same as last test for o
    let innerValues = nestedMap.getInnerValues("o");
    expect(innerValues.average).to.equal(0.75);
    expect(innerValues.outerKey).to.equal("o");
    expect(innerValues.arr.length).to.equal(2);
    expect(innerValues.arr[0].key).to.equal(123);
    expect(innerValues.arr[0].value).to.equal(1);
    expect(innerValues.arr[1].key).to.equal(124);
    expect(innerValues.arr[1].value).to.equal(0.5);

    // now verify o2
    innerValues = nestedMap.getInnerValues("o2");
    expect(innerValues.average).to.equal(0.8);
    expect(innerValues.outerKey).to.equal("o2");
    expect(innerValues.arr.length).to.equal(1);
    expect(innerValues.arr[0].key).to.equal(125);
    expect(innerValues.arr[0].value).to.equal(0.8);
  });

  it("uses constructor custom labels correctly", () => {
    nestedMap = new NestedMap("a", "b", "c", "d", "e");
    nestedMap.set("o", 123, 1);

    let outerKeys = nestedMap.getOuterKeys();
    expect(outerKeys.a.length).to.equal(1);
    expect(outerKeys.a[0].b).to.equal("o");

    let innerValues = nestedMap.getInnerValues("o");
    expect(innerValues.average).to.equal(1);
    expect(innerValues.b).to.equal("o");
    expect(innerValues.c.length).to.equal(1);
    expect(innerValues.c[0].d).to.equal(123);
    expect(innerValues.c[0].e).to.equal(1);
  });

  it("ignores non-numeric values", () => {
    nestedMap = new NestedMap();
    nestedMap.set("o", "i", "A");
    let outerKeys = nestedMap.getOuterKeys();
    expect(outerKeys.wrapper.length).to.equal(0);
  });

  it("accepts numeric string score", () => {
    nestedMap = new NestedMap();
    nestedMap.set("o", "i", "0.5");
    let outerKeys = nestedMap.getOuterKeys();
    expect(outerKeys.wrapper.length).to.equal(1);
  });

  it("ignores out-of-range values", () => {
    nestedMap = new NestedMap();
    nestedMap.set("o", "i", -0.1);
    nestedMap.set("o", "i", 1.111112);
    let outerKeys = nestedMap.getOuterKeys();
    expect(outerKeys.wrapper.length).to.equal(0);
  });
});
