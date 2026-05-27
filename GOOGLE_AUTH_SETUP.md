# Setting Up Google OAuth in Supabase

## 1 — Google Cloud Console

1. Go to https://console.cloud.google.com
2. Create a new project (or use existing)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add Authorized redirect URI:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
   (find this in Supabase Dashboard → Authentication → Providers → Google)
7. Copy the **Client ID** and **Client Secret**

---

## 2 — Supabase Dashboard

1. Go to your project → **Authentication → Providers**
2. Enable **Google**
3. Paste in the Client ID and Client Secret from step above
4. Save

---

## 3 — Admin HTML file

Open `frontend/html/admin.html` and replace the two config lines at the top of the script:

```js
const SUPABASE_URL  = "https://your-project-id.supabase.co";  // ← your real URL
const SUPABASE_ANON = "your-supabase-anon-key";               // ← from Project Settings → API
```

These are safe to put in client-side code — the anon key has no write permissions
except what your RLS policies explicitly allow.

---

## 4 — Restricting to specific Google accounts (optional but recommended)

In Supabase Dashboard → **Authentication → Hooks** or via the auth config,
you can add an email allowlist so only your specific Gmail addresses
can log in. Alternatively, add a check in `src/middleware/auth.js`:

```js
const ALLOWED_EMAILS = ["yourname@gmail.com", "colleague@gmail.com"];

async function verifyAdminToken(req, res, next) {
  // ... existing token verification ...

  if (!ALLOWED_EMAILS.includes(data.user.email)) {
    return res.status(403).json({ error: "Access denied." });
  }

  req.user = data.user;
  next();
}
```

---

## 5 — Environment variables needed

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJ...
VOTE_PRICE_NAIRA=100
PORT=3000
```


