# Get Exams List

Lists all the exams that have been recorded

**URL** : `/exams`

**Method** : `GET`

**Success Response Code** : `200 OK`

## Examples

If exam records are available:

```json
{ "exams": [{ "exam": 3840 }, { "exam": 3841 }, { "exam": 3842 }] }
```

If no exam records are available:

```json
{ "exams": [] }
```
