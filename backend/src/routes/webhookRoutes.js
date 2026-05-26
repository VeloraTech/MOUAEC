const express = require("express");
const { isValidWebhookSignature } = require("../services/paystack");
const { logWebhook, processSuccessfulCharge } = require("../services/voteService");

const router = express.Router();

router.post("/webhook/paystack", async (req, res) => {
  const signature = req.headers["x-paystack-signature"];
  const event = req.body || {};
  const eventType = event?.event || "unknown";
  const paystackReference = event?.data?.reference || `invalid_${Date.now()}`;
  const amountKobo = Number(event?.data?.amount || 0);

  try {
    const rawBody = req.rawBody || "";
    const valid = isValidWebhookSignature(rawBody, signature);
    if (!valid) {
      await logWebhook({
        paystackReference,
        eventType,
        amount: Math.floor(amountKobo / 100),
        action: "invalid_signature"
      });
      return res.sendStatus(200);
    }

    if (eventType !== "charge.success") {
      return res.sendStatus(200);
    }

    await processSuccessfulCharge({ paystackReference, amountKobo, eventType });
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(200);
  }
});

module.exports = router;
