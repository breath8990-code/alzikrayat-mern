# Alzikrayat, MERN Edition

A full-stack photo-sharing application for the Advanced Web Technologies course (Project 3).
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
  middleware/           validation.js (Joi), auth.js, upload.js (multer), errorHandler.js
  uploads/              stored image files
  server.js             app entry point
client/                 React + Vite front end
  src/components/       Navbar, Footer, PhotoCard, CommentForm, LoginForm, RegisterForm, ...
  src/pages/            Home, Gallery, PhotoDetail, AddPhoto, LoginRegister, About, NotFound
  src/context/          AuthContext (logged-in user state)
  src/api.js            all fetch calls to the API
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
| POST | `/api/auth/register` | no | Create an account (password hashed with bcrypt) | 201 |
| POST | `/api/auth/login` | no | Log in, returns the public profile | 200 |
| GET | `/api/photos` | no | List photos, newest first | 200 |
| GET | `/api/photos/:id` | no | One photo | 200 |
| POST | `/api/photos` | yes | Upload a photo (multipart: `photo`, `title`, `description`) | 201 |
| DELETE | `/api/photos/:id` | owner | Delete the photo, its file, and its comments | 204 |
| GET | `/api/photos/:id/comments` | no | Comments of a photo, newest first | 200 |
| POST | `/api/photos/:id/comments` | yes | Add a comment | 201 |

Error codes used: 400 (validation failed or invalid id), 401 (not logged in or wrong credentials),
403 (deleting someone else's photo), 404 (not found), 409 (email already registered).

## Authentication (basic)

As the project specification requires, this is basic authentication only. After login the client keeps
the user in React state and `localStorage`, and sends the user's id in an `x-user-id` header on write
requests. The server checks that the user exists (`middleware/auth.js`) and checks ownership before
deleting. Because there are no signed tokens, this is not secure enough for production; JWT is the
upgrade offered in the optional Project 4.

## Security basics

- Passwords are hashed with bcrypt and the hash is never returned by the API.
- Secrets live in `.env`, which is excluded by `.gitignore`.
- All input is validated on the server with Joi.
- Uploads accept only JPG, PNG, GIF and WEBP up to 5 MB, and are stored under random file names.
