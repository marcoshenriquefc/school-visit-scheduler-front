# Authentication

## Flow
1. User logs in at `/login` via `POST /auth/login`.
2. JWT token is stored in cookie (`handle_token`).
3. App fetches current user with `GET /auth/me`.
4. Middleware protects `/admin` routes.
5. On `401`, session is cleared and user is redirected to `/login`.

## Store
`stores/auth.ts` handles token, user, init, login, logout and session checks.
