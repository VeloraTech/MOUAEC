# MOUAU Anonymous Voting Backend

Node.js + Express backend for one-week anonymous voting with Paystack transfer and Supabase Postgres.

## Folder structure

```text
backend/
  package.json
  .env.example
  README.md
  sql/
    schema.sql
  src/
    server.js
    config/
      env.js
    db/
      pool.js
    routes/
      voteRoutes.js
      webhookRoutes.js
    services/
      paystack.js
      voteService.js
```

## Environment variables

Copy `.env.example` to `.env` and fill:

- `PORT`
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_WEBHOOK_SECRET`
- `PAYSTACK_BASE_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (service role key, not anon)
- `SUPABASE_DB_URL`
- `VOTE_PRICE` (example `100`)
- `ALLOWED_ORIGINS`

## Setup

1. Install dependencies:
   `npm install`
2. Run schema in Supabase SQL editor:
   `backend/sql/schema.sql`
3. Start local server:
   `npm run dev`

## API endpoints

### 1) `POST /vote`
Body:

```json
{
  "contestant_id": 1
}
```

Response:

```json
{
  "session_id": "uuid",
  "account_number": "1234567890",
  "bank_name": "Wema Bank",
  "account_name": "MOUAU Voting"
}
```

### 2) `POST /webhook/paystack`

- Always returns HTTP 200.
- Validates `x-paystack-signature`.
- Processes only `charge.success`.
- Uses DB transaction for idempotency + vote update + contestant increment.

### 3) `GET /vote-status/:session_id`
Response:

```json
{
  "status": "pending",
  "votes_credited": 0,
  "contestant_id": 1
}
```

## Vote calculation

Votes are computed on webhook:

`votes = Math.floor((amount_kobo / 100) / VOTE_PRICE)`

`amount_kobo` comes from Paystack webhook payload.

## Session expiry

A cron job runs every minute in `src/server.js`:

- marks all `pending` sessions with `expires_at < now()` as `expired`.

## Paystack webhook registration

1. Open Paystack Dashboard.
2. Go to `Settings` -> `API Keys & Webhooks`.
3. Set webhook URL to:
   `https://<your-render-backend-domain>/webhook/paystack`
4. Save.
5. Make sure `PAYSTACK_WEBHOOK_SECRET` in Render matches the Paystack dashboard value.

## Render deployment

1. Push `backend` folder to GitHub (can be same repo).
2. In Render, create **Web Service**.
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all env vars from `.env.example`.
7. Deploy.

## Frontend polling integration

After `/vote` response:

1. Show account number/bank/account name to user.
2. Poll `GET /vote-status/:session_id` every 3 seconds.
3. Stop polling when `status === "paid"` or `status === "expired"`.

