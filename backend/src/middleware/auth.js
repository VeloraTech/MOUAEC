const { createClient } = require("@supabase/supabase-js");

const ALLOWED_EMAILS = [
  "techvelora001@gmail.com",
  "alpheausdalighton@gmail.com",
];

async function verifyAdminToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "No auth token provided." });
  }

  const userClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } },
  );

  const { data, error } = await userClient.auth.getUser();

  if (error || !data?.user) {
    return res.status(401).json({ error: "Invalid or expired session. Please log in again." });
  }

  const email = String(data.user.email || "").toLowerCase();
  if (!ALLOWED_EMAILS.includes(email)) {
    return res.status(403).json({ error: "Access denied." });
  }

  req.user = data.user;
  next();
}

module.exports = { verifyAdminToken };
