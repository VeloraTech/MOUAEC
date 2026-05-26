const crypto = require("crypto");
const { paystackBaseUrl, paystackSecretKey, paystackWebhookSecret } = require("../config/env");

async function createVirtualAccountCharge({ sessionId, amountKobo = 100 }) {
  const reference = `vote_${sessionId}`;
  const payload = {
    email: `sess_${sessionId}@vote.internal`,
    amount: amountKobo,
    channels: ["bank_transfer"],
    currency: "NGN",
    reference,
    metadata: {
      session_id: sessionId
    }
  };

  const res = await fetch(`${paystackBaseUrl}/charge`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${paystackSecretKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok || !data.status) {
    throw new Error(data?.message || "Unable to create Paystack charge");
  }

  const transferInfo = data?.data?.authorization;
  if (!transferInfo?.receiver_bank_account_number) {
    throw new Error("Paystack did not return virtual account details");
  }

  return {
    paystackReference: data.data.reference,
    accountNumber: transferInfo.receiver_bank_account_number,
    bankName: transferInfo.receiver_bank,
    accountName: transferInfo.account_name || "MOUAU Voting",
    raw: data
  };
}

function isValidWebhookSignature(rawBody, signature) {
  if (!signature) return false;
  const hash = crypto
    .createHmac("sha512", paystackWebhookSecret)
    .update(rawBody)
    .digest("hex");
  return hash === signature;
}

module.exports = {
  createVirtualAccountCharge,
  isValidWebhookSignature
};
