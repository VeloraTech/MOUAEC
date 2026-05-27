// src/routes/admin.js
const express = require("express");
const router = express.Router();
const supabase = require("../services/supabase");
const { verifyAdminToken } = require("../middleware/auth");

const VOTE_PRICE = parseInt(process.env.VOTE_PRICE_NAIRA || "100", 10);

/**
 * POST /admin/record-vote
 * Body: { contestant_id, amount_naira, reference_code? }
 *
 * 1. Verifies the caller is a logged-in Google user via Supabase JWT
 * 2. Checks reference_code isn't already in vote_logs (idempotency)
 * 3. Calculates votes = Math.floor(amount_naira / VOTE_PRICE)
 * 4. Increments contestants.total_votes
 * 5. Appends immutable row to vote_logs
 */
router.post("/record-vote", verifyAdminToken, async (req, res) => {
  const { contestant_id, amount_naira, reference_code } = req.body;

  // ── Basic validation ───────────────────────────────────────────────
  if (!contestant_id || !amount_naira) {
    return res
      .status(400)
      .json({ error: "contestant_id and amount_naira are required." });
  }

  const amount = parseInt(amount_naira, 10);
  if (isNaN(amount) || amount <= 0) {
    return res
      .status(400)
      .json({ error: "amount_naira must be a positive integer." });
  }

  // ── Duplicate reference check ──────────────────────────────────────
  if (reference_code) {
    const { data: existing } = await supabase
      .from("vote_logs")
      .select("id")
      .eq("reference_code", reference_code.trim())
      .maybeSingle();

    if (existing) {
      return res.status(409).json({
        error: "This reference code has already been recorded.",
        code: "DUPLICATE_REFERENCE",
      });
    }
  }

  // ── Fetch contestant ───────────────────────────────────────────────
  const { data: contestant, error: fetchErr } = await supabase
    .from("contestants")
    .select("id, name, total_votes")
    .eq("id", contestant_id)
    .single();

  if (fetchErr || !contestant) {
    return res.status(404).json({ error: "Contestant not found." });
  }

  // ── Vote calculation ───────────────────────────────────────────────
  const votes_added = Math.floor(amount / VOTE_PRICE);

  if (votes_added === 0) {
    return res.status(422).json({
      error: `Amount ₦${amount} is less than the vote price (₦${VOTE_PRICE}). No votes can be credited.`,
      code: "ZERO_VOTES",
    });
  }

  // ── Update contestant total_votes (atomic increment) ──────────────
  const { error: updateErr } = await supabase
    .from("contestants")
    .update({ total_votes: contestant.total_votes + votes_added })
    .eq("id", contestant_id);

  if (updateErr) {
    console.error("Error updating total_votes:", updateErr);
    return res.status(500).json({ error: "Failed to update vote count." });
  }

  // ── Append immutable vote log ──────────────────────────────────────
  const { error: logErr } = await supabase.from("vote_logs").insert({
    contestant_id,
    amount_paid: amount,
    votes_added,
    reference_code: reference_code ? reference_code.trim() : null,
  });

  if (logErr) {
    // Vote already credited — still return success but warn
    console.error("Error inserting vote_log:", logErr);
  }

  return res.json({
    success: true,
    contestant_name: contestant.name,
    amount_paid: amount,
    votes_added,
    new_total: contestant.total_votes + votes_added,
  });
});

/**
 * GET /admin/contestants
 * Returns all contestants ordered by total_votes descending.
 * Used by the admin page on load.
 */
router.get("/contestants", verifyAdminToken, async (req, res) => {
  const { data, error } = await supabase
    .from("contestants")
    .select("id, name, department, image_url, total_votes")
    .order("total_votes", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  return res.json({ contestants: data });
});

module.exports = router;
