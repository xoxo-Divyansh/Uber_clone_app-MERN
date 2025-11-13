# Backend API Documentation

Status: matches current backend implementation (users + captions).  
Notes: JWT payload uses {\_id: <mongoId>}, token expiry 24h, password fields
stored with `select: false`. Token may be sent in Authorization header
`Bearer <token>` or cookie named `token`. Blacklist is persisted in
`models/blacklistToken.model.js` and middleware checks it.

Table of contents

- Users
  - POST /users/register
  - POST /users/login
  - GET /users/profile
  - GET /users/logout
- Captions
  - POST /captions/register
  - POST /captions/login
  - GET /captions/profile
  - GET /captions/logout
- Implementation notes / gotchas

---

## Users

### POST /users/register

Description

- Create a new user and return a JWT + created user object (password omitted).

URL

- POST /users/register

Headers

- Content-Type: application/json

Request body (required shape)

```json
{
  "fullname": { "firstname": "string", "lastname": "string (optional)" },
  "email": "string (valid email)",
  "password": "string (min 6 chars)"
}
```

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

### POST /users/login

Description

- Authenticate an existing user. On success return a JWT + user object (password
  omitted).
- Implemented by `userController.loginUser` (controllers/user.controller.js) and
  exposed in `routes/user.routes.js`.

URL

- POST /users/login

Headers

- Content-Type: application/json

Request body (required shape)

```json
{
  "email": "string (valid email)",
  "password": "string (min 6 chars)"
}
```

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

### GET /users/profile

Description

- Return the authenticated user's profile.
- Protected route — requires a valid JWT (sent in Authorization header as
  "Bearer <token>" or in a cookie named `token`).
- Implemented by `userController.getUserProfile` and guarded by
  `auth.middleware.authUser`.

URL

- GET /users/profile

Headers

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

### GET /users/logout

Description

- Logs out the authenticated user by clearing the token cookie and adding the
  token to a blacklist (so subsequent requests with the same token are
  rejected).
- Protected route — requires a valid JWT.
- Implemented by `userController.logoutUser` which uses `blacklistTokenModel` to
  save invalidated tokens.

URL

- GET /users/logout

Headers

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

## Captions

### POST /captions/register

Description

- Create a new caption (driver) and return a JWT + created caption object
  (password omitted).

URL

- POST /captions/register

Headers

- Content-Type: application/json

Request body (required shape)

```json
{
  "fullname": { "firstname": "string", "lastname": "string (optional)" },
  "email": "string (valid email)",
  "password": "string (min 6 chars)",
  "vehical": {
    "plate": "string (min 3 chars)",
    "color": "string (required)",
    "capacity": "number (min 1)",
    "vehicalType": "string (one of ['car', 'bike', 'van', 'tuktuk', 'suv'])"
  }
}
```

Validation rules (as implemented in `routes/caption.routes.js`)

- email: must be a valid email (express-validator `.isEmail()`).
- fullname.firstname: minimum 3 characters.
- password: minimum 6 characters.
- vehical.color: required.
- vehical.plate: minimum 3 characters.
- vehical.capacity: must be an integer greater than or equal to 1.
- vehical.vehicalType: must be one of the specified types.

Example request

- POST /captions/register
- Body:
  ```json
  {
    "fullname": { "firstname": "Jane", "lastname": "Doe" },
    "email": "jane.doe@example.com",
    "password": "securepassword",
    "vehical": {
      "plate": "ABC123",
      "color": "red",
      "capacity": 4,
      "vehicalType": "car"
    }
  }
  ```

Responses / Status codes

- 201 Created

  - Description: Caption created successfully.
  - Body:
    ```json
    {
      "token": "<jwt>",
      "caption": { ...created caption object... }
    }
    ```

- 400 Bad Request

  - Description: Validation errors. Returned when express-validator detects
    invalid input.
  - Body:
    ```json
    {
      "errors": [ ... ]
    }
    ```

- 409 Conflict

  - Description: Caption with the provided email already exists.
  - Body:
    ```json
    {
      "message": "Caption with this email already exists"
    }
    ```

- 500 Internal Server Error
  - Description: Unexpected server or database error (e.g., DB connection
    failure).

Notes & links

- Route definition: `routes/caption.routes.js`
- Controller: `controllers/caption.controller.js` — `registerCaption`
- Service: `services/caption.service.js` — `createCaption`
- Model: `models/caption.model.js` — includes `captionModel.hashPassword` and
  token generation

### POST /captions/login

Description

- Authenticate a caption (driver). On success return a JWT + caption object
  (password omitted).

URL

- POST /captions/login

Headers

- Content-Type: application/json

Request body (required shape)

```json
{
  "email": "string (valid email)",
  "password": "string (min 6 chars)"
}
```

Validation rules

- email: must be a valid email.
- password: minimum 6 characters.

Behavior / Implementation notes

- Controller finds the caption by email and selects the password explicitly
  (e.g. `captionModel.findOne({ email }).select("+password")`) because password
  is stored with `select: false`.
- Password comparison uses bcrypt via `caption.comparePassword(password)`
  (schema method).
- On success a JWT is created with `caption.generateAuthToken()` and returned.
- Ensure tokens are sent to client (cookie or Authorization header) and that
  stored captions have passwords hashed exactly once.

Example request

- POST /captions/login
- Body: { "email": "jane.doe@example.com", "password": "securepassword" }

Responses / Status codes

- 200 OK
  - Body: { "token": "<jwt>", "caption": { ...caption object (no password)... }
    }
- 400 Bad Request
  - Validation errors: { "errors": [ ... ] }
- 401 Unauthorized
  - Invalid credentials: { "message": "Invalid email or password" }
- 500 Internal Server Error
  - Server/db errors.

### GET /captions/profile

Description

- Return the authenticated caption's profile.
- Protected route — requires a valid JWT (Authorization: Bearer <token> or
  cookie `token`).
- Implemented by `captionController.getCaptionProfile` and guarded by
  `auth.middleware.authCaption`.

URL

- GET /captions/profile

Headers

- Authorization: Bearer <token> (or cookie: token=<token>)

Behavior / Implementation notes

- `authCaption` middleware verifies the token, checks blacklist, finds the
  caption by decoded id and attaches it as `req.caption`.
- Controller returns `req.caption`. Password is excluded from response.

Example request

- GET /captions/profile
- Headers: Authorization: Bearer <jwt>

Responses / Status codes

- 200 OK
  - Body: { "caption": { ...caption object (no password)... } }
- 401 Unauthorized
  - Missing/invalid token or caption not found.
- 500 Internal Server Error
  - Server/db errors.

### GET /captions/logout

Description

- Logs out the authenticated caption by blacklisting the token and clearing the
  token cookie.
- Protected route — requires a valid JWT.
- Implemented by `captionController.logoutCaption` and uses
  `blacklistTokenModel` to persist invalidated tokens.

URL

- GET /captions/logout

Headers

- Authorization: Bearer <token> (or cookie: token=<token>)

Behavior / Implementation notes

- Controller reads token (cookie or Bearer header), upserts the token into
  blacklist collection, clears the `token` cookie and returns success.
- `authCaption` middleware must check `blacklistTokenModel` so blacklisted
  tokens are rejected.

Example request

- GET /captions/logout
- Headers: Authorization: Bearer <jwt>

Responses / Status codes

- 200 OK
  - Body: { "message": "Logged out successfully" }
- 401 Unauthorized
  - Missing/invalid token.
- 500 Internal Server Error
  - DB or blacklist save failure.

Notes & links

- Routes: `routes/caption.routes.js`
- Controller: `controllers/caption.controller.js` — `loginCaption`,
  `getCaptionProfile`, `logoutCaption`
- Model: `models/caption.model.js` — `comparePassword`, `generateAuthToken`,
  password stored with `select: false`
- Middleware: `middlewares/auth.middleware.js` — `authCaption` must handle
  Bearer header / cookie and check blacklist
- Blacklist model: `models/blacklistToken.model.js`

## Implementation notes / gotchas

- JWT payloads for users and captions include the MongoDB `_id` field as `id`.
- Password fields are stored with `select: false` in Mongoose, meaning they
  won't be returned in queries unless explicitly included (e.g.
  `.select("+password")`).
- Token expiry is set to 24 hours; after expiry, refresh tokens should be used
  (if implemented) or the user/caption must log in again.
- Blacklist functionality is optional; if implemented, it should persist
  blacklisted tokens in a collection (e.g. `blacklistTokenModel`) and middleware
  should check this blacklist on protected routes.
