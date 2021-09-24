class NestedMap {
  constructor(
    wrapper = "wrapper",
    outerKey = "outerKey",
    arr = "arr",
    key = "key",
    value = "value"
  ) {
    // outerMap maps to innerMaps of key, value pairs
    this.outerMap = new Map();

    this.wrapper = wrapper;
    this.outerKey = outerKey;
    this.arr = arr;
    this.key = key;
    this.value = value;
  }

  set(outerKey, innerKey, value) {
    if (isNaN(value)) {
      return; // ignore values that aren't numeric
    }

    // map keys must be strings, so cast them as such.
    // as we may numeric data coming in.
    outerKey = String(outerKey);
    innerKey = String(innerKey);
    value = Number(value);

    // update the value for the inner map
    let innerMap = this.outerMap.get(outerKey);
    if (innerMap === undefined) {
      innerMap = new Map();
    }
    innerMap.set(innerKey, value);
    this.outerMap.set(outerKey, innerMap);
  }

  getOuterKeys() {
    let res = [];

    for (let outerKey of this.outerMap.keys()) {
      let obj = {};
      obj[this.outerKey] = outerKey;
      res.push(obj);
    }

    let retObj = {};
    retObj[this.wrapper] = res;

    return retObj;
  }

  getInnerValues(outerKey) {
    let values = [];
    let innerMap = this.outerMap.get(outerKey);
    let sum = 0;
    let average = 0;

    if (innerMap !== undefined) {
      for (let innerKey of innerMap.keys()) {
        let obj = {};
        obj[this.key] = innerKey;

        let value = innerMap.get(innerKey);
        obj[this.value] = value;

        values.push(obj);
        sum += value;
      }
    }

    if (sum !== 0) average = sum / innerMap.size;

    let obj = {};
    obj[this.outerKey] = outerKey;
    obj.average = average;
    obj[this.arr] = values;

    return obj;
  }
}

module.exports = NestedMap;
