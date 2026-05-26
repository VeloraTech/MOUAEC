-- contestants table
CREATE TABLE IF NOT EXISTS contestants (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT,
  badge TEXT,
  total_votes INTEGER NOT NULL DEFAULT 0
);

-- vote sessions table
CREATE TABLE IF NOT EXISTS vote_sessions (
  session_id UUID PRIMARY KEY,
  contestant_id BIGINT NOT NULL REFERENCES contestants(id) ON DELETE CASCADE,
  paystack_reference TEXT NOT NULL UNIQUE,
  amount_received INTEGER,
  votes_credited INTEGER,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_vote_sessions_status_expires
  ON vote_sessions (status, expires_at);

-- webhook log table
CREATE TABLE IF NOT EXISTS webhook_log (
  id BIGSERIAL PRIMARY KEY,
  paystack_reference TEXT NOT NULL UNIQUE,
  event_type TEXT,
  amount INTEGER,
  action TEXT NOT NULL CHECK (action IN ('votes_recorded', 'duplicate_ignored', 'invalid_signature', 'zero_votes')),
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
