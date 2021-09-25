# LD test scores app

## Building

- You will need `node` and `npm` installed.
- I am using `node` version **v10.19.0** and `npm` version **6.14.4**.
- Run `npm install`

## Running

- Run `node src/server.js` in the root of the project. Then see **testing** below.

## Manual Testing

- By default, app is served on port 3000, but you can change this in **config/default.json** (or **conifg/test.json** in the case of running unit tests)

- Access the endpoints using either your web browser (Chrome/Firefox/etc) or use `curl`:

```bash
$ curl http://localhost:3000/students
```

## Unit tests

- Run `npm run test` in the root of the project to run **_mocha/chai_** unit tests

## Server-sent-events definition

## REST API definitions

* [Get Students List](docs/students-list.md) : `GET /students`
* [Get Student Scores](docs/student-scores.md) : `GET /students/:id`
* [Get Exams List](docs/exams-list.md) : `GET /exams`
* [Get Exam Scores](docs/exam-scores.md) : `GET /exams/:number`
