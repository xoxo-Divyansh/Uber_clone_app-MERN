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

# /users/login

Description

- Authenticates an existing user. On success returns a JWT token and the user
  object (password is not included in the response).
- Implemented by `userController.loginUser` (controllers/user.controller.js) and
  exposed in `routes/user.routes.js`.

URL

- POST /users/login

Request headers

- Content-Type: application/json

Request body (JSON)

- Required shape: { "email": "string (valid email)", "password": "string (min 6
  chars)" }

Validation rules (as implemented in `routes/user.routes.js`)

- email: must be a valid email (express-validator `.isEmail()`).
- password: minimum 6 characters.

Behavior / Implementation notes

- The controller finds the user by email and selects the password field
  explicitly (e.g. `userModel.findOne({ email }).select("+password")`) because
  the password field is stored with `select: false`.
- Passwords are compared using bcrypt via `user.comparePassword(password)` (a
  schema method).
- On successful authentication a JWT is created with `user.generateAuthToken()`
  and returned with the user object.
- Ensure stored users are hashed exactly once when created; existing
  double-hashed records will fail to authenticate.

Example request

- POST /users/login
- Body: { "email": "john.doe@example.com", "password": "secret123" }

Responses / Status codes

- 200 OK

  - Description: Authentication successful.
  - Body: { "token": "<jwt>", "user": { ...user object (no password)... } }

- 400 Bad Request

  - Description: Validation errors (missing/invalid fields).
  - Body: { "errors": [ ... ] }

- 401 Unauthorized

  - Description: Invalid credentials (email not found or password mismatch).
  - Common messages returned by the controller:
    - "Invalid email or password 1" (user not found)
    - "Invalid email or password 2" (password mismatch)

- 500 Internal Server Error
  - Description: Unexpected server error (DB, token generation, etc.)

Notes & links

- Route definition: `routes/user.routes.js`
- Controller: `controllers/user.controller.js` — `loginUser`
- Model: `models/user.model.js` — `comparePassword`, `generateAuthToken`,
  `password` field is `select: false`

# /users/profile

Description

- Returns the authenticated user's profile.
- Protected route — requires a valid JWT (sent in Authorization header as
  "Bearer <token>" or in a cookie named `token`).
- Implemented by `userController.getUserProfile` and guarded by
  `auth.middleware.authUser`.

URL

- GET /users/profile

Request headers

- Authorization: Bearer <token> (or cookie: token=<token>)
- Content-Type: application/json

Behavior / Implementation notes

- The `authUser` middleware verifies the token, finds the user, and attaches it
  as `req.user`.
- The controller responds with the user object. The password field is excluded
  from the response because the schema sets `password.select = false`.

Example request

- GET /users/profile
- Headers: Authorization: Bearer <jwt>

Responses / Status codes

- 200 OK

  - Description: Profile retrieved successfully.
  - Body: { "user": { ...user object (no password)... } }

- 401 Unauthorized

  - Description: Missing or invalid token, or user not found.
  - Body: { "message": "Unauthorized: No token provided" } or { "message":
    "Unauthorized: Invalid token" }

- 500 Internal Server Error
  - Description: Unexpected server error.

# /users/logout

Description

- Logs out the authenticated user by clearing the token cookie and adding the
  token to a blacklist (so subsequent requests with the same token are
  rejected).
- Protected route — requires a valid JWT.
- Implemented by `userController.logoutUser` which uses `blacklistTokenModel` to
  save invalidated tokens.

URL

- GET /users/logout

Request headers

- Authorization: Bearer <token> (or cookie: token=<token>)

Behavior / Implementation notes

- Controller reads token from cookie or Authorization header, clears the `token`
  cookie, and persists the token to a blacklist collection.
- Subsequent requests are checked against the blacklist in
  `auth.middleware.authUser` (ensure middleware checks the blacklist correctly).

Example request

- GET /users/logout
- Headers: Authorization: Bearer <jwt>

Responses / Status codes

- 200 OK

  - Description: Logged out successfully.
  - Body: { "message": "Logged out successfully" }

- 401 Unauthorized

  - Description: Missing or invalid token.
  - Body: { "message": "Unauthorized: No token provided" } or { "message":
    "Unauthorized: Invalid token" }

- 500 Internal Server Error
  - Description: Unexpected server error (DB, blacklist save failure, etc.)

Notes & links

- Route definitions: `routes/user.routes.js` —
  `router.get("/profile", authMiddleware.authUser, ...)` and
  `router.get("/logout", authMiddleware.authUser, ...)`
- Controller: `controllers/user.controller.js` — `getUserProfile`, `logoutUser`
- Middleware: `middlewares/auth.middleware.js` — verifies token and should check
  blacklist
- Blacklist model: `models/backlistToken.model.js` (used to store invalidated
  tokens)
