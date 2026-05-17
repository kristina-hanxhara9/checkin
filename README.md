# PropertyCheck

AI-powered rental property inspection app. Multi-tenant SaaS — your clients sign in with their own Microsoft account, and inspection data lives in **their** OneDrive.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- MSAL for multi-tenant Microsoft sign-in
- Microsoft Graph API (OneDrive)
- Google Gemini (2.5 Flash for categorisation, 2.5 Pro for comparison)
- Puppeteer for PDF rendering

## Setup

### Prerequisites

- **Node.js ≥ 20** (Next.js 15 requires 18.18+ or 20+; LTS 20.x recommended)

### 1. Install

```bash
npm install
```

`.npmrc` sets `legacy-peer-deps=true` because `@azure/msal-react@2` declares a React 18 peer dep while the app uses React 19 (works fine in practice).

### 2. Register a multi-tenant Azure app

Go to [portal.azure.com](https://portal.azure.com) → **App registrations** → **New registration**.

- **Name**: `PropertyCheck` (or your product name)
- **Supported account types**: _Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts_
- **Redirect URI**: select **Single-page application (SPA)**, enter `http://localhost:3000`

After creation:

- **API permissions** → Microsoft Graph → **Delegated** → add `Files.ReadWrite` and `User.Read`. Do **not** click "Grant admin consent" — each client will consent themselves.
- (Recommended) **Branding** → upload your logo and publisher info — this is what your clients see on the consent screen.
- (Recommended) Submit for **publisher verification** once you have customers, so the consent screen shows a verified badge.
- Copy the **Application (client) ID**.

### 3. Get a Gemini API key

Visit [aistudio.google.com/apikey](https://aistudio.google.com/apikey), create a key. This is your shared cost — all clients use the same key.

### 4. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in:

```env
NEXT_PUBLIC_AZURE_CLIENT_ID=<your-app-id>
NEXT_PUBLIC_AZURE_AUTHORITY=https://login.microsoftonline.com/common
NEXT_PUBLIC_AZURE_REDIRECT_URI=http://localhost:3000
GEMINI_API_KEY=<your-gemini-key>
```

### 5. Run

```bash
npm run dev
```

Open <http://localhost:3000>.

## Usage flow

1. Sign in with Microsoft (first-time clients see a consent dialog).
2. Create a property (`Properties/12a-Thornton-Road/` is created in their OneDrive).
3. Create a tenancy (`Properties/12a-Thornton-Road/Smith-2025-05/`).
4. **Check-in**: drop photos → run categorisation → review the AI's grouping/ratings → finalise. PDF + JSON saved to OneDrive.
5. **Check-out**: same as check-in.
6. **Compare**: Gemini 2.5 Pro produces a deposit recommendation with per-item verdicts. Generate the comparison PDF.

## OneDrive folder layout

```
Properties/
  <property-slug>/
    <tenancy-slug>/
      check-in/
        photos/*.jpg
        checkin-data.json
        checkin-report.pdf
      check-out/
        photos/*.jpg
        checkout-data.json
        checkout-report.pdf
      comparison-data.json
      comparison-report.pdf
```

State is derived from which files exist — no separate database.

## Deployment notes

- Puppeteer + Chromium is ~170MB. **Recommended**: deploy on a Node host (Railway, Fly.io, a VPS).
- If you must use Vercel, swap `puppeteer` for `puppeteer-core` + `@sparticuz/chromium`, and set `maxDuration: 60` (already wired in the relevant routes).

## Common issues

- **`interaction_required` after sign-in**: usually wrong `AZURE_AUTHORITY`. Use `common` for any work/school OR personal accounts; `organizations` for work/school only.
- **`AADSTS65001`**: an enterprise tenant blocks user consent. Direct the admin to `https://login.microsoftonline.com/{tenant-id}/adminconsent?client_id=<your-client-id>` to pre-approve the app.
- **Categorisation truncated**: tenancies with 50+ photos can hit token limits. Split into smaller phases or upgrade the model in `lib/constants.ts`.
- **Puppeteer fails to start**: set `PUPPETEER_EXECUTABLE_PATH` to a Chrome binary on the host.
