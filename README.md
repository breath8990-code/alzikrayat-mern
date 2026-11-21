# Alzikrayat, MERN Edition

A full-stack photo-sharing application for the Advanced Web Technologies course (Project 3),
extended with JWT authentication for the optional bonus Project 4 (Track A).
Members register, log in, upload photos, browse a responsive gallery, open a photo's detail page,
and comment on it. Only the owner of a photo can delete it.

**Stack:** MongoDB + Mongoose, Express.js REST API, React (Vite) with React Router, Node.js.
No meta-frameworks and no pre-built dashboards.

## Project structure

```
server/                 Express REST API
  models/               User.js, Photo.js, Comment.js (Mongoose schemas)
  routes/               authRoutes.js, photoRoutes.js, commentRoutes.js
  controllers/          authController.js, photoController.js, commentController.js
  middleware/           validation.js (Joi), auth.js (JWT protect), upload.js (multer), errorHandler.js
  uploads/              stored image files
  server.js             app entry point
client/                 React + Vite front end
  src/components/       Navbar, Footer, PhotoCard, CommentForm, LoginForm, RegisterForm, ...
  src/pages/            Home, Gallery, PhotoDetail, AddPhoto, LoginRegister, About, NotFound
  src/context/          AuthContext (logged-in user and token)
  src/api.js            Axios instance with interceptors and all API calls
```

## Requirements

- Node.js 18 or newer
- MongoDB running locally, or a free MongoDB Atlas cluster

## Setup and run

### 1. Server

```bash
cd server
npm install
cp .env.example .env      # on Windows: copy .env.example .env
```

Edit `server/.env`:

| Variable | Meaning | Example |
|----------|---------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/alzikrayat` |
| `PORT` | API port | `5000` |
| `CLIENT_ORIGIN` | Allowed front-end origin (CORS) | `http://localhost:5173` |
| `JWT_SECRET` | Secret used to sign tokens (required, keep it private) | a long random string |
| `JWT_EXPIRES_IN` | How long a token is valid | `1d` |

Generate a strong secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then start it:

```bash
npm run dev       # auto-restart with nodemon
# or
npm start
```

### 2. Client

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173. In development, Vite forwards `/api` and `/uploads` to the server
on port 5000 (see `client/vite.config.js`), so no extra configuration is needed.

For a deployed build, set `VITE_API_URL` in `client/.env` to the public API URL before `npm run build`.

## REST API

| Method | Route | Auth | Description | Success |
|--------|-------|------|-------------|---------|
| POST | `/api/auth/register` | no | Create an account (password hashed with bcrypt), returns `{ token, user }` | 201 |
| POST | `/api/auth/login` | no | Log in, returns `{ token, user }` | 200 |
| GET | `/api/auth/me` | token | Returns the logged-in user (used to check a stored token) | 200 |
| GET | `/api/photos` | no | List photos, newest first | 200 |
| GET | `/api/photos/:id` | no | One photo | 200 |
| POST | `/api/photos` | token | Upload a photo (multipart: `photo`, `title`, `description`) | 201 |
| DELETE | `/api/photos/:id` | token (owner) | Delete the photo, its file, and its comments | 204 |
| GET | `/api/photos/:id/comments` | no | Comments of a photo, newest first | 200 |
| POST | `/api/photos/:id/comments` | token | Add a comment | 201 |

Error codes used: 400 (validation failed or invalid id), 401 (not logged in or wrong credentials),
403 (deleting someone else's photo), 404 (not found), 409 (email already registered).

## Project 4, Track A: JWT authentication

**Why this track:** Project 3 used basic authentication, where the client sent the user's id in a header
and the server trusted it. Anyone who knew an id could act as that user. JWT fixes this with a signed,
expiring token that only the server can create, and it is the smallest change that keeps every other
feature of the app untouched.

**How it works**

1. `POST /api/auth/register` or `POST /api/auth/login` checks the input with Joi, hashes or compares the
   password with bcrypt, and returns `{ token, user }`.
2. The token is a JWT with three parts: a header (`HS256`), a payload (`{ id, iat, exp }`, no password),
   and a signature made with `JWT_SECRET` from `.env`.
3. The client stores the token in `localStorage` and an Axios request interceptor (`client/src/api.js`)
   adds `Authorization: Bearer <token>` to every request automatically.
4. The `protect` middleware (`server/middleware/auth.js`) checks the header, verifies the signature and the
   expiry, loads the user, and sets `req.user`. It is applied to every write route: upload, delete and comment.
   Deleting a photo still checks on the server that the user owns it.
5. If the token is missing, invalid or expired, the API answers 401. An Axios response interceptor then logs
   the user out, so the navbar goes back to "Please Login".
6. Logout clears the token and the user from `localStorage` and React state.
7. When the app opens, it calls `GET /api/auth/me` to check that the stored token still works.

**Setup for this track:** add `JWT_SECRET` and `JWT_EXPIRES_IN` to `server/.env` (see the table above),
then run `npm install` again in `server` (adds `jsonwebtoken`) and in `client` (adds `axios`).
The server refuses to start if `JWT_SECRET` is missing. Existing accounts keep working, because
passwords were already stored as bcrypt hashes; users just log in again to get a token.

Not included: refresh tokens (optional in the specification). A token is valid until `JWT_EXPIRES_IN`,
then the user logs in again.

## Security basics

- Passwords are hashed with bcrypt and the hash is never returned by the API.
- Secrets (`MONGODB_URI`, `JWT_SECRET`) live in `.env`, which is excluded by `.gitignore`.
- Write routes require a valid, unexpired JWT, and tokens are verified with an explicit `HS256` algorithm.
- All input is validated on the server with Joi.
- Uploads accept only JPG, PNG, GIF and WEBP up to 5 MB, and are stored under random file names.
