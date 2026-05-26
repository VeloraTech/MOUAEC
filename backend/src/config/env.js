const dotenv = require("dotenv");

dotenv.config();

const required = [
  "PAYSTACK_SECRET_KEY",
  "PAYSTACK_WEBHOOK_SECRET",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_DB_URL",
  "VOTE_PRICE"
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env variable: ${key}`);
  }
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,
  paystackWebhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET,
  paystackBaseUrl: process.env.PAYSTACK_BASE_URL || "https://api.paystack.co",
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  supabaseDbUrl: process.env.SUPABASE_DB_URL,
  votePrice: Number(process.env.VOTE_PRICE),
  allowedOrigins: (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
};
