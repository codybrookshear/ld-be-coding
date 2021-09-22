var EventSource = require("eventsource");
var express = require("express");

const PORT = process.env.PORT || 3000;

const eventSource = new EventSource(
  "https://live-test-scores.herokuapp.com/scores"
);

// TODO put in separate file
// studentMap maps a studentId to an array of {exam, score}
// examMap maps an exam to an array of {student, score}
class ScoreMap {
  set(record) {
    let studentRecord = { exam: record.exam, score: record.score };
    let examRecord = { studentId: record.studentId, score: record.store };

    this.studentMap[record.studentId] = studentRecord;
    this.examMap[record.exam] = examRecord;

    console.log(
      "studentRecord: " + studentRecord + ", examRecord: " + examRecord
    );
  }

  // TODO unset(key)
}

var app = express();
var scoreMap = new ScoreMap();

// receive data from the event source and store it
// add to json array
eventSource.addEventListener("score", function (e) {
  scoreMap.set(e.data);
});

// Define REST API routes we serve

app.get("/students", function (req, res) {
  res.send('[{ studentId: "bob" }]');
});

app.get("/students/:id", function (req, res) {
  res.send(
    "{ studentId: " +
      req.params.id +
      ', average: "99", test-results: [99, 100, 98] }'
  );
});

app.get("/exams", function (req, res) {
  res.send("{ [16149, 16150] }");
});

app.get("/exams/:number", function (req, res) {
  res.send('{ exam: "' + req.params.number + '" { 1, 2 3 }');
});

app.listen(PORT, function () {
  console.log("App listening on port " + PORT);
});
