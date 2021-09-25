# Get Student Scores

Lists the test results for the specified student, and provides the student's average score across all exams

**URL** : `/students/:id`

**Method** : `GET`

**Success Response Code** : `200 OK`

## Examples

For a student `:id` of **Sabryna40** received, that has records available:

```json
{
  "studentId": "Sabryna40",
  "average": 0.7398501057176734,
  "scores": [
    { "exam": 3920, "score": 0.7694035744995812 },
    { "exam": 3921, "score": 0.6969360846679576 },
    { "exam": 3922, "score": 0.7509925380451277 },
    { "exam": 3923, "score": 0.6491307492157913 }
  ]
}
```

For an student `:id` of **Michael** received, but that has no records for that student avialable:

```json
{ "studentId": "Michael", "average": 0, "scores": [] }
```
