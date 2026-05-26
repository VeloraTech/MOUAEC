const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { createVirtualAccountCharge } = require("../services/paystack");
const { createVoteSession, getVoteStatus } = require("../services/voteService");

const router = express.Router();

router.post("/vote", async (req, res) => {
  try {
    const { contestant_id: contestantId } = req.body || {};
    if (!contestantId) {
      return res.status(400).json({ error: "contestant_id is required" });
    }

    const sessionId = uuidv4();
    const charge = await createVirtualAccountCharge({ sessionId });

    await createVoteSession({
      sessionId,
      contestantId,
      paystackReference: charge.paystackReference
    });

    return res.status(200).json({
      session_id: sessionId,
      account_number: charge.accountNumber,
      bank_name: charge.bankName,
      account_name: charge.accountName
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unable to create vote session" });
  }
});

router.get("/vote-status/:session_id", async (req, res) => {
  try {
    const { session_id: sessionId } = req.params;
    const record = await getVoteStatus(sessionId);
    if (!record) {
      return res.status(404).json({ error: "session not found" });
    }
    return res.status(200).json({
      status: record.status,
      votes_credited: Number(record.votes_credited || 0),
      contestant_id: record.contestant_id
    });
  } catch (error) {
    return res.status(500).json({ error: "Unable to fetch vote status" });
  }
});

module.exports = router;
