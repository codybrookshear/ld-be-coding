var EventSource = require("eventsource");
var express = require("express");

const PORT = process.env.PORT || 3000;

const eventSource = new EventSource(
  "https://live-test-scores.herokuapp.com/scores"
);

// TODO put in separate file

class NestedMap {
  constructor() {
    // outerMap maps to innerMaps of key, value pairs
    this.outerMap = new Map();
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

  // req.params.number,
  //  "students",
  //  "studentId",
  //  "score"

  getInnerValues(
    outerKeyLabel,
    outerKey,
    strArrayLabel,
    strKeyLabel,
    strValueLabel
  ) {
    let values = [];
    let innerMap = this.outerMap.get(outerKey);
    let sum = 0;
    let average = 0;

    if (innerMap !== undefined) {
      for (let innerKey of innerMap.keys()) {
        let obj = {};
        obj[strKeyLabel] = innerKey;

        let value = innerMap.get(innerKey);
        obj[strValueLabel] = value;

        values.push(obj);
        sum += value;
      }
    }

    if (sum !== 0) average = sum / innerMap.size;

    let obj = {};
    obj[outerKeyLabel] = outerKey;
    obj.average = average;
    obj[strArrayLabel] = values;

    return obj;
  }
}

var app = express();
var studentData = new NestedMap();
var examData = new NestedMap();

// receive data from the event source and store it
// add to json array
eventSource.addEventListener("score", function (e) {
  let data = JSON.parse(e.data);
  let { studentId, exam, score } = data;

  studentData.set(studentId, exam, score);
  examData.set(exam, studentId, score);
});

// Define REST API routes we serve

app.get("/students", function (req, res) {
  let students = studentData.getOuterKeys("studentId");
  res.send({ students: students });
});

app.get("/students/:id", function (req, res) {
  let scores = studentData.getInnerValues(
    "studentId",
    req.params.id,
    "scores",
    "exam",
    "score"
  );
  res.send(scores);
  // TODO put in json, and get average here
});

app.get("/exams", function (req, res) {
  let exams = examData.getOuterKeys("exam");
  res.send({ exams: exams });
});

app.get("/exams/:number", function (req, res) {
  let scores = examData.getInnerValues(
    "exam",
    req.params.number,
    "scores",
    "studentId",
    "score"
  );

  res.send(scores);
  // TODO put in json, and get average here
});

app.listen(PORT, function () {
  console.log("App listening on port " + PORT);
});
