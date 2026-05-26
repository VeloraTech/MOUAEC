const { pool } = require("../db/pool");
const { votePrice } = require("../config/env");

async function createVoteSession({ sessionId, contestantId, paystackReference }) {
  const query = `
    INSERT INTO vote_sessions
      (session_id, contestant_id, paystack_reference, status, created_at, expires_at)
    VALUES
      ($1, $2, $3, 'pending', NOW(), NOW() + INTERVAL '30 minutes')
    RETURNING session_id, contestant_id, paystack_reference, status, created_at, expires_at
  `;
  const values = [sessionId, contestantId, paystackReference];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function getVoteStatus(sessionId) {
  const query = `
    SELECT session_id, contestant_id, status, COALESCE(votes_credited, 0) AS votes_credited
    FROM vote_sessions
    WHERE session_id = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(query, [sessionId]);
  return rows[0] || null;
}

async function expireStaleSessions() {
  const query = `
    UPDATE vote_sessions
    SET status = 'expired'
    WHERE status = 'pending' AND expires_at < NOW()
  `;
  const res = await pool.query(query);
  return res.rowCount;
}

async function logWebhook({
  paystackReference,
  eventType,
  amount = null,
  action
}) {
  const query = `
    INSERT INTO webhook_log (paystack_reference, event_type, amount, action, received_at)
    VALUES ($1, $2, $3, $4, NOW())
    ON CONFLICT (paystack_reference) DO NOTHING
  `;
  await pool.query(query, [paystackReference, eventType, amount, action]);
}

async function processSuccessfulCharge({ paystackReference, amountKobo, eventType }) {
  const client = await pool.connect();
  const amountNaira = Math.floor(Number(amountKobo) / 100);
  const votes = Math.floor(amountNaira / votePrice);

  try {
    await client.query("BEGIN");

    const dupCheck = await client.query(
      "SELECT id FROM webhook_log WHERE paystack_reference = $1 LIMIT 1",
      [paystackReference]
    );

    if (dupCheck.rowCount > 0) {
      await client.query(
        `UPDATE webhook_log
         SET action = 'duplicate_ignored', received_at = NOW()
         WHERE paystack_reference = $1`,
        [paystackReference]
      );
      await client.query("COMMIT");
      return { outcome: "duplicate_ignored" };
    }

    const sessionRes = await client.query(
      `SELECT session_id, contestant_id, status
       FROM vote_sessions
       WHERE paystack_reference = $1
       FOR UPDATE`,
      [paystackReference]
    );

    if (sessionRes.rowCount === 0) {
      await client.query(
        `INSERT INTO webhook_log (paystack_reference, event_type, amount, action, received_at)
         VALUES ($1, $2, $3, 'zero_votes', NOW())
         ON CONFLICT (paystack_reference) DO NOTHING`,
        [paystackReference, eventType, amountNaira]
      );
      await client.query("COMMIT");
      return { outcome: "session_not_found" };
    }

    if (votes === 0) {
      await client.query(
        `INSERT INTO webhook_log (paystack_reference, event_type, amount, action, received_at)
         VALUES ($1, $2, $3, 'zero_votes', NOW())`,
        [paystackReference, eventType, amountNaira]
      );
      await client.query("COMMIT");
      return { outcome: "zero_votes" };
    }

    await client.query(
      `UPDATE vote_sessions
       SET status = 'paid', amount_received = $1, votes_credited = $2
       WHERE paystack_reference = $3`,
      [amountNaira, votes, paystackReference]
    );

    await client.query(
      `UPDATE contestants
       SET total_votes = COALESCE(total_votes, 0) + $1
       WHERE id = $2`,
      [votes, sessionRes.rows[0].contestant_id]
    );

    await client.query(
      `INSERT INTO webhook_log (paystack_reference, event_type, amount, action, received_at)
       VALUES ($1, $2, $3, 'votes_recorded', NOW())`,
      [paystackReference, eventType, amountNaira]
    );

    await client.query("COMMIT");
    return { outcome: "votes_recorded", votes };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  createVoteSession,
  getVoteStatus,
  expireStaleSessions,
  logWebhook,
  processSuccessfulCharge
};
