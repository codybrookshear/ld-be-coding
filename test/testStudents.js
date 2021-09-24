const chai = require("chai");
const expect = chai.expect;
const server = require("../src/server");
const config = require("config");

//server.studentData

describe("verify /students endpoint", () => {
  it("returns empty student data correctly", () => {
    let studentData = server.getStudentData();
    //studentData.set("Tom", 1334, 0.77);
    //console.log("outer: " + JSON.stringify(studentData.getOuterKeys()));

    // now connect to the server and get data
  });
});
