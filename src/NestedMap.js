/**
 * A class to store student exam data. It tires to be generic and useful
 * outside of that specific use case, but doesn't quite acheive.
 */

class NestedMap {
  /**
   * Constructor is a bit unweildy. We need all these strings so we can
   * provide the exact names the client wants for each object, so they
   * don't have to later copy to another object with the desired names.
   * @param {string} wrapper label for wrapper object returned by functions
   * @param {string} outerKey label for outerKey variable returned by functions
   * @param {string} arr label for arr variable returned by functions
   * @param {string} key label for key variable returned by functions
   * @param {string} value label for value variable returned by functions
   * @param {boolean} castOuterKeyAsNumber 'true' if functions should cast outer key as a number
   * @param {boolean} castInnerKeyAsNumber 'true' if functions should cast inner key as a number
   */
  constructor(
    wrapper = "wrapper",
    outerKey = "outerKey",
    arr = "arr",
    key = "key",
    value = "value",
    castOuterKeyAsNumber = false,
    castInnerKeyAsNumber = true
  ) {
    /** outerMap maps to innerMaps of key, value pairs */
    this.outerMap = new Map();

    this.wrapper = wrapper;
    this.outerKey = outerKey;
    this.arr = arr;
    this.key = key;
    this.value = value;
    this.castInnerKeyAsNumber = castInnerKeyAsNumber;
    this.castOuterKeyAsNumber = castOuterKeyAsNumber;
  }

  /**
   * Inserts a new set of values into the map
   * @param {*} outerKey outer key to set
   * @param {*} innerKey inner key to set
   * @param {number} value value to set
   */
  set(outerKey, innerKey, value) {
    // ignore values that aren't numeric
    if (isNaN(value)) {
      return;
    }

    // ensure value is between 0 and 1
    value = Number(value);
    if (value < 0 || value > 1) {
      return;
    }

    // map keys must be strings, so cast them as such.
    // as we may numeric data coming in.
    outerKey = String(outerKey);
    innerKey = String(innerKey);

    // update the value for the inner map
    let innerMap = this.outerMap.get(outerKey);
    if (innerMap === undefined) {
      innerMap = new Map();
    }
    innerMap.set(innerKey, value);
    this.outerMap.set(outerKey, innerMap);
  }

  /**
   * Clears the conents of our outerMap (and thus the innerMap(s) contents)
   */
  clear() {
    this.outerMap.clear();
  }

  /**
   * Gets a list of the outerKeys in an opionanted way
   * (i.e. matching the caller's desired REST API)
   * @returns {Object} example:
   */
  getOuterKeys() {
    let res = [];

    for (let outerKey of this.outerMap.keys()) {
      let obj = {};
      if (this.castOuterKeyAsNumber) {
        obj[this.outerKey] = Number(outerKey);
      } else {
        obj[this.outerKey] = outerKey;
      }

      res.push(obj);
    }

    let retObj = {};
    retObj[this.wrapper] = res;

    return retObj;
  }
  /**
   * @param {string} outerKey the key to match in the outer map
   * @returns {Object} an object containing an array of inner key, value pairs
   * along with an average of values
   */
  getInnerValues(outerKey) {
    let values = [];
    let innerMap = this.outerMap.get(outerKey);
    let sum = 0;
    let average = 0;

    if (innerMap !== undefined) {
      for (let innerKey of innerMap.keys()) {
        let obj = {};

        if (this.castInnerKeyAsNumber === true) {
          obj[this.key] = Number(innerKey);
        } else {
          obj[this.key] = innerKey;
        }

        let value = innerMap.get(innerKey);
        obj[this.value] = value;

        values.push(obj);
        sum += value;
      }
    }

    if (sum !== 0) average = sum / innerMap.size;

    let obj = {};

    if (this.castOuterKeyAsNumber) {
      obj[this.outerKey] = Number(outerKey);
    } else {
      obj[this.outerKey] = outerKey;
    }

    obj.average = average;
    obj[this.arr] = values;

    return obj;
  }
}

/**
 * Export this class for use in other files
 */
module.exports = NestedMap;
