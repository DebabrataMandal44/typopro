
# Accounts & Sync Strategy

## Architecture
- **Stateless JWT**: Use JWTs stored in HttpOnly cookies for session management.
- **Sync Protocol**:
  - App first saves to `localStorage`.
  - Background process attempts to POST `/api/sync` with the delta of sessions.
  - Conflicts resolved by `timestamp` (latest wins).

## Security
- **Bcrypt**: For password hashing.
- **Rate Limiting**: Prevent brute-force on `/login` and `/register`.
- **Validation**: Zod schemas for all incoming user data.

## Guest-to-User Migration
When a user registers, the local `history` array from `localStorage` is uploaded to the server to preserve their progress.
