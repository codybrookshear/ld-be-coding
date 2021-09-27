const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const server = require("../src/server");
const config = require("config");

describe("verify event source", () => {
  it("has bogus event source for testing", () => {
    expect(config.eventSource).to.equal("bogus");
  });

  it("ignores bad event source input", () => {
    server.clearScores();

    server.insertScore(1, 1334, 0.81); // bad studentId
    server.insertScore("Rick", "bad", 0.81); // bad exam
    server.insertScore("Rick", 1334, -0.81); // bad score
    server.insertScore("Rick", 1334, 2.81); // bad score

    chai
      .request("http://localhost:" + config.port)
      .get("/students/Rick")
      .end((err, res) => {
        expect(res.body.scores.length).to.equal(0);
      });

    chai
      .request("http://localhost:" + config.port)
      .get("/exams/1334")
      .end((err, res) => {
        expect(res.body.scores.length).to.equal(0);
      });

    server.clearScores();
  });
});
