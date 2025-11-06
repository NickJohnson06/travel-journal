# API Server

## Scripts
- dev: `npm run dev`
- start: `npm start`

## Env
- PORT=4000
- MONGO_URI=mongodb://127.0.0.1:27017/travel_journal
- JWT_SECRET=change_me
- NODE_ENV=development
- CLIENT_ORIGIN=http://localhost:5173

## Smoke test
- Start MongoDB
- `npm run dev`
- GET http://localhost:4000/api/health -> { ok: true }
- POST http://localhost:4000/api/auth/signup { username, password }
- GET  http://localhost:4000/api/auth/me (with cookie) -> user object