# API reference

Base URL: `http://localhost:3000`

Authenticated requests use `Authorization: Bearer <token>`.

| Method and path | Auth | Request body | Success | Errors |
|---|---|---|---|---|
| `POST /users/register` | No | `{ "fullName": "Ada Lovelace", "username": "ada", "password": "secret123" }` | 201 | 400, 409 |
| `POST /users/login` | No | `{ "username": "ada", "password": "secret123" }` | 200 | 400, 401 |
| `GET /users/me` | Yes | — | 200 | 401 |
| `GET /notifications` | Yes | — | 200 | 401 |
| `POST /notifications` | Yes | `{ "header": "Build complete", "body": "The build finished.", "category": "INFO" }` | 201 | 400, 401 |
| `GET /notifications/:id` | Yes | — | 200 | 400, 401, 404 |
| `PUT /notifications/:id` | Yes | `{ "header": "Updated header", "body": "Updated body", "category": "WARNING" }` | 200 | 400, 401, 404 |
| `DELETE /notifications/:id` | Yes | — | 200 | 400, 401, 404 |

`category` must be `INFO`, `WARNING`, or `ERROR`. Notification IDs must be valid MongoDB ObjectIds.
