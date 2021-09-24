class NestedMap {
  constructor(outerKeyLabel, strArrayLabel, strKeyLabel, strValueLabel) {
    // outerMap maps to innerMaps of key, value pairs
    this.outerMap = new Map();

    this.outerKeyLabel = outerKeyLabel;
    this.strArrayLabel = strArrayLabel;
    this.strKeyLabel = strKeyLabel;
    this.strValueLabel = strValueLabel;
  }

  set(outerKey, innerKey, value) {
    // TODO verify value is a number

    // rewrite exam as a string so we can use it as a map key
    outerKey = String(outerKey);
    innerKey = String(innerKey);

    // update this student's map of exams to scores
    let innerMap = this.outerMap.get(outerKey);
    if (innerMap === undefined) {
      innerMap = new Map();
    }
    innerMap.set(innerKey, value);
    this.outerMap.set(outerKey, innerMap);
  }

  getOuterKeys(objName) {
    let res = [];

    for (let outerKey of this.outerMap.keys()) {
      let obj = {};
      obj[objName] = outerKey;
      res.push(obj);
    }

    return res;
  }

  getInnerValues(outerKey) {
    let values = [];
    let innerMap = this.outerMap.get(outerKey);
    let sum = 0;
    let average = 0;

    if (innerMap !== undefined) {
      for (let innerKey of innerMap.keys()) {
        let obj = {};
        obj[this.strKeyLabel] = innerKey;

        let value = innerMap.get(innerKey);
        obj[this.strValueLabel] = value;

        values.push(obj);
        sum += value;
      }
    }

    if (sum !== 0) average = sum / innerMap.size;

    let obj = {};
    obj[this.outerKeyLabel] = outerKey;
    obj.average = average;
    obj[this.strArrayLabel] = values;

    return obj;
  }
}

module.exports = NestedMap;
