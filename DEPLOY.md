# Deploying to Render

Step-by-step. Total time: ~20 minutes. Cost: $7/month (Starter plan).

## 1. Push the repo to GitHub

If you haven't already:

```bash
cd /Users/kristinahanxhara/checkin-checkout
git init
git add .
git commit -m "Initial commit"
# Create a new private repo on github.com, then:
git remote add origin git@github.com:YOUR_USERNAME/propertycheck.git
git branch -M main
git push -u origin main
```

> **Do NOT commit `.env.local`** — it's in `.gitignore`, double-check before pushing.

## 2. Sign up + create the service on Render

1. Go to <https://render.com> → sign up (use GitHub for one-click)
2. Dashboard → **New +** → **Blueprint**
3. Pick your `propertycheck` repo → Render detects `render.yaml` and offers to create the service
4. Click **Apply**

## 3. Fill in the three secret env vars

After the blueprint creates the service, click into it → **Environment** → fill the three `sync: false` vars:

| Key                           | Value                                                                |
| ----------------------------- | -------------------------------------------------------------------- |
| `NEXT_PUBLIC_AZURE_CLIENT_ID` | `a9a569ec-3cbd-4984-a5e2-30792240404e`                              |
| `NEXT_PUBLIC_AZURE_REDIRECT_URI` | `https://propertycheck.onrender.com` (or whatever Render assigns) |
| `GEMINI_API_KEY`              | (paste your Gemini key)                                              |

> Click **Save changes** — Render redeploys automatically.

## 4. Update Azure to allow the production URL

1. <https://portal.azure.com> → **Microsoft Entra ID** → **App registrations** → **PropertyCheck**
2. Left sidebar → **Authentication**
3. Under **Single-page application** redirect URIs, click **Add URI**
4. Paste your Render URL — e.g. `https://propertycheck.onrender.com` (no trailing slash)
5. Keep `http://localhost:3000` in the list too — that's still your dev URL
6. **Save**

## 5. Verify it works

1. Open `https://propertycheck.onrender.com` (or your assigned URL)
2. First load: 30-60s while Render warms up (only the very first time)
3. Click **Sign in with Microsoft** → consent → land on `/properties`
4. Run a real check-in to verify Puppeteer/PDF generation works on Render

## 6. (Later) Custom domain + publisher verification

Once you have customers and a brand:

1. Buy a domain (`propertycheck.co.uk` or similar)
2. Render → service → **Settings** → **Custom Domain** → add the domain → follow CNAME instructions at your registrar
3. Add the **new** domain as an Azure SPA redirect URI (you can keep the `onrender.com` one too during transition)
4. Update `NEXT_PUBLIC_AZURE_REDIRECT_URI` on Render to the new domain
5. Follow Azure publisher verification: see the "How to do #3" section of our chat / the README

## Common issues

**Build fails on Render with "react peer dependency" error**
→ Make sure `NPM_CONFIG_LEGACY_PEER_DEPS=true` is set (already in `render.yaml`).

**Puppeteer fails on Render with "Failed to launch chromium"**
→ Bump the plan to **Standard** ($25/mo, 2GB RAM). Starter's 512MB is borderline for Puppeteer.

**"Sign-in redirect mismatch"**
→ Your `NEXT_PUBLIC_AZURE_REDIRECT_URI` env var doesn't match the URL listed in Azure → Authentication. They must match exactly (including https, no trailing slash).

**First load is slow**
→ Starter plan stays warm. If you're on Free, the service sleeps after 15min idle and takes ~30s to wake. Upgrade to Starter.

**Cost concern**
→ Starter is $7/mo. If you want $0/mo, use Free plan but expect cold starts.
