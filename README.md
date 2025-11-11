## Backend API Documentation
# /users/register

Description

- Registers a new user and returns a JWT token plus the created user.
- Endpoint implemented by
  [`userController.registerUser`](controllers/user.controller.js) and wired in
  [`routes/user.routes.js`](routes/user.routes.js). The controller uses
  [`userService.createUser`](services/user.service.js) which ultimately persists
  data via [`userModel`](models/user.model.js). See also app mount in
  [`app.js`](app.js).

URL

- POST /users/register

Request headers

- Content-Type: application/json

Request body (JSON)

- Required shape: { "fullname": { "firstname": "string (min 3 chars)",
  "lastname": "string (optional, min 3 chars)" }, "email": "string (valid
  email)", "password": "string (min 6 chars)" }

Validation rules (as implemented in
[`routes/user.routes.js`](routes/user.routes.js))

- email: must be a valid email (express-validator `.isEmail()`).
- fullname.firstname: minimum 3 characters.
- password: minimum 6 characters.

Example request

- POST /users/register
- Body: { "fullname": { "firstname": "John", "lastname": "Doe" }, "email":
  "john.doe@example.com", "password": "secret123" }

Responses / Status codes

- 201 Created

  - Description: User created successfully.
  - Body: { "token": "<jwt>", "user": { ...created user object... } }
  - Produced by [`userController.registerUser`](controllers/user.controller.js)
    after calling [`userService.createUser`](services/user.service.js).

- 400 Bad Request

  - Description: Validation errors. Returned when express-validator detects
    invalid input.
  - Body: { "errors": [ ... ] }

- 500 Internal Server Error
  - Description: Unexpected server or database error (e.g., DB connection
    failure).

Notes & links

- Route definition: [routes/user.routes.js](routes/user.routes.js)
- Controller: [controllers/user.controller.js](controllers/user.controller.js) —
  exports [`userController.registerUser`](controllers/user.controller.js)
- Service: [services/user.service.js](services/user.service.js) — exports
  [`userService.createUser`](services/user.service.js)
- Model: [models/user.model.js](models/user.model.js) — includes
  [`userModel.hashPassword`](models/user.model.js) and token generation
- App entry: [app.js](app.js)
