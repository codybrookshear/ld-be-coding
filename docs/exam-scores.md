# Get Exam Scores

Lists all the scores by student ID for the specified exam, and provides the average score across all students

**URL** : `/exams/:number`

**Method** : `GET`

**Success Response Code** : `200 OK`

## Examples

For an exam `:number` of **3713** received, that has records available:

```json
{
  "exam": 3713,
  "average": 0.7083116663113125,
  "scores": [
    { "studentId": "Kane_Dibbert57", "score": 0.6103434091884126 },
    { "studentId": "Mitchell_Botsford90", "score": 0.6860829217770622 }
  ]
}
```

For an exam `:number` of **3713** received, but that has no records for that exam avialable:

```json
{ "exam": 3713, "average": 0, "scores": [] }
```
