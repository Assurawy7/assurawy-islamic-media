# Deploying Assurawy Islamic Media

Two supported paths: **Vercel + managed Postgres** (recommended, least ops)
or **self-hosted Docker** (full control, e.g. a VPS). Both use the same
codebase — nothing to change between them beyond environment variables.

---

## Option A — Vercel + managed Postgres (recommended)

### 1. Provision a Postgres database

Pick one (all have generous free tiers and give you a pooled connection
string, which matters for serverless):

- [Neon](https://neon.tech) — serverless Postgres, branching, easy pooler
- [Supabase](https://supabase.com) — Postgres + built-in storage if you want
  it later for videos/PDFs
- Vercel Postgres (via the Vercel dashboard's Storage tab)

Copy the **pooled** connection string (often has `-pooler` in the hostname,
or uses port `6543` instead of `5432`). Serverless functions open many
short-lived connections; the pooler prevents connection exhaustion.

### 2. Push the repo to GitHub (or GitLab/Bitbucket)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 3. Import the project into Vercel

1. [vercel.com/new](https://vercel.com/new) → import the repo.
2. Framework preset: Next.js (auto-detected).
3. Under **Environment Variables**, add:

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | your pooled Postgres connection string |
   | `JWT_SECRET` | output of `openssl rand -base64 32` |
   | `NEXT_PUBLIC_SITE_URL` | your production URL, e.g. `https://assurawy.org` |

4. Deploy.

Because `package.json` has a `vercel-build` script
(`prisma generate && prisma migrate deploy && next build`), Vercel runs it
automatically instead of the plain `build` script — so schema migrations
apply on every deploy with no extra setup. `postinstall` also runs
`prisma generate` as a safety net.

### 4. Seed production data (once)

Run this from your local machine with `DATABASE_URL` pointed at production
(e.g. via `vercel env pull` to get a `.env` with the real value), **not**
as part of the automated build:

```bash
vercel env pull .env.production.local
DATABASE_URL="<paste-from-file>" npm run seed
```

Change the seeded passwords immediately after (`Password123!` is for local
dev only — see "Post-deploy checklist" below).

### 5. Add your domain

Vercel dashboard → Project → Settings → Domains → add `assurawy.org` (or
your domain) and follow the DNS instructions. Vercel handles HTTPS
certificates automatically.

---

## Option B — Self-hosted with Docker

Use this on a VPS (e.g. Hetzner, DigitalOcean, a Linode droplet) if you'd
rather not depend on Vercel.

### 1. Set environment variables

```bash
cp .env.example .env
# edit .env: set JWT_SECRET, NEXT_PUBLIC_SITE_URL
```

### 2. Bring the stack up

```bash
docker compose up -d --build
```

This starts a Postgres container and the app container (built from the
included multi-stage `Dockerfile`, using Next's `standalone` output so the
final image doesn't need `node_modules` copied in full).

### 3. Run migrations and seed

```bash
docker compose exec app npx prisma migrate deploy
docker compose exec app npm run seed   # optional, first time only
```

### 4. Put a reverse proxy in front

Use Caddy, Nginx, or Traefik in front of port 3000 for HTTPS termination and
your domain. A minimal Caddyfile:

```
assurawy.org {
  reverse_proxy localhost:3000
}
```

Caddy handles Let's Encrypt certificates automatically.

---

## Environment variables reference

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | Postgres connection string. Use the pooled URL on serverless. |
| `JWT_SECRET` | Yes | Long random string, unique per environment. Session tokens are signed with this — rotating it logs everyone out. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Used by `robots.ts`/`sitemap.ts`, SEO metadata, and the Paystack callback URL. |
| `NODE_ENV` | Set by host | `production` enables secure (HTTPS-only) session cookies — see `lib/auth.ts` / the cookie options in the auth routes. |
| `PAYSTACK_SECRET_KEY` | For paid courses | From the Paystack dashboard. Omit and priced courses return a clear "not configured" error; free courses are unaffected. |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | For paid courses | Paystack's public key (safe to expose client-side). |
| `S3_ENDPOINT` | For cloud uploads | Omit for real AWS S3; set for R2/other S3-compatible providers. |
| `S3_REGION` | For cloud uploads | e.g. `auto` (R2) or `us-east-1` (AWS). |
| `S3_BUCKET` | For cloud uploads | Bucket name. |
| `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` | For cloud uploads | Credentials scoped to that bucket only — don't reuse root account keys. |
| `S3_PUBLIC_URL_BASE` | For cloud uploads | The public base URL files are served from (e.g. an R2 public bucket URL or a CDN in front of it). |
| `WHATSAPP_TOKEN` / `WHATSAPP_PHONE_NUMBER_ID` | For notifications | From a Meta App with the WhatsApp product added. See `lib/whatsapp.ts` for the template names it expects. |

Every integration above is optional at the code level — the app runs and
builds fine with none of them set, degrading gracefully (uploads fall back
to local disk, WhatsApp sends are skipped and logged, paid courses show an
error instead of crashing). Add them when you're ready for each feature.

---

## Setting up Paystack

1. Create an account at [paystack.com](https://paystack.com) and complete
   business verification (required before you can accept live payments from
   Nigerian cards/bank transfers).
2. Dashboard → Settings → API Keys & Webhooks → copy the secret and public
   keys into `PAYSTACK_SECRET_KEY` / `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`. Use
   the `sk_test_...` / `pk_test_...` pair while developing.
3. In the same screen, set the webhook URL to
   `https://yourdomain.com/api/payments/webhook`. This is what actually
   confirms payment in production — the browser redirect
   (`/payment/callback`) is just a faster UX path for the common case.
4. Test with Paystack's documented test card numbers before going live, then
   swap in the live key pair once verification is complete.

## Setting up cloud file storage

Any S3-compatible provider works. Cloudflare R2 is a reasonable default
(no egress fees, generous free tier):

1. Create an R2 bucket, then a public access URL (R2 dashboard → bucket →
   Settings → Public Access) or front it with a custom domain.
2. Create an API token scoped to that bucket (R2 → Manage API Tokens).
3. Set `S3_ENDPOINT` to `https://<account-id>.r2.cloudflarestorage.com`,
   `S3_REGION=auto`, and fill in the bucket name, keys, and public URL base.
4. Without these set, `/api/uploads` falls back to writing into
   `public/uploads` on local disk — fine for dev/self-hosted, but Vercel's
   filesystem is ephemeral, so **cloud storage is required before enabling
   uploads on Vercel**.

## Setting up WhatsApp notifications

1. Create a Meta App at [developers.facebook.com](https://developers.facebook.com/apps)
   and add the WhatsApp product.
2. Generate a permanent access token (System User token in Meta Business
   Manager, not the 24-hour test token) → `WHATSAPP_TOKEN`.
3. Copy the sending number's Phone Number ID from the API Setup page →
   `WHATSAPP_PHONE_NUMBER_ID`.
4. Create and submit for approval the three message templates
   `lib/whatsapp.ts` expects: `enrollment_confirmation`,
   `certificate_issued`, `payment_success` (Meta Business Manager → Account
   Tools → Message Templates). Approval typically takes a few hours to a
   day. Until they're approved, sends will fail — harmlessly, since
   `lib/whatsapp.ts` catches and logs rather than throwing.

---

## Post-deploy checklist

- [ ] Change or remove the seeded accounts (`admin@assurawy.org`,
      `ibrahim.sani@assurawy.org`, `fatima@example.com` all share the
      password `Password123!` — fine for local dev, not for production).
- [ ] Confirm `JWT_SECRET` is a real random value, not the placeholder.
- [ ] Confirm cookies are only sent over HTTPS — this is automatic once
      `NODE_ENV=production` (see the `secure: process.env.NODE_ENV === "production"`
      flag on the session cookie in `app/api/auth/*`).
- [ ] Hit `GET /api/health` after deploying — it checks both the app and
      the database connection and returns `503` if the DB is unreachable.
      Point an uptime monitor (e.g. UptimeRobot, Better Uptime) at it.
- [ ] The in-memory rate limiter in `lib/rate-limit.ts` protects a single
      long-running server well, but on serverless (Vercel) each function
      instance has its own memory. For real protection there, swap it for
      `@upstash/ratelimit` (a few lines — the `checkRateLimit` function
      signature is designed to be a drop-in swap).
- [ ] Configure cloud storage (`S3_*`) before enabling PDF/video uploads on
      Vercel — see "Setting up cloud file storage" above.
- [ ] Switch Paystack to live keys and confirm the webhook URL is set,
      before accepting real payments — see "Setting up Paystack" above.
- [ ] Register and get approval for the WhatsApp message templates before
      relying on notifications — see "Setting up WhatsApp" above.
- [ ] Set up automated Postgres backups (Neon/Supabase do this by default
      on paid tiers; on a self-hosted box, schedule `pg_dump`).
- [ ] After deploying, open the site on a phone and confirm the "Add to
      Home Screen" / install prompt appears (Android Chrome shows it
      automatically; iOS Safari requires the user to tap Share → "Add to
      Home Screen" — there's no install prompt on iOS). See "PWA / installable
      app" below.
- [ ] Run a Lighthouse audit (Chrome DevTools → Lighthouse) against the
      production URL and confirm the PWA, Performance, and SEO scores are
      all green before announcing launch.

---

## PWA / installable app

The app is installable on both Android and iOS via a web manifest
(`public/manifest.webmanifest`) and a service worker (`public/sw.js`,
registered by `components/ServiceWorkerRegister.tsx`).

Deliberately conservative caching, since this app handles auth and payments:

- `/api/*` is **never** cached — every request always hits the network.
  Caching auth/payment/enrollment responses could serve stale session
  state or double-submit a payment, so this is a hard rule, not a
  performance tradeoff.
- Static build assets (`/_next/static/*`, `/icons/*`) are cached
  aggressively — they're content-hashed, so a new deploy gets new URLs
  automatically.
- Page navigations are network-first, falling back to `public/offline.html`
  only when there's genuinely no connection.

Icons live in `public/icons/` (192/512/maskable/apple-touch/favicons). If you
rebrand, regenerate all of them — they're referenced by exact filename in
both `manifest.webmanifest` and `app/layout.tsx`'s `icons` metadata.

`next.config.js` sets `Cache-Control: no-cache` specifically on `/sw.js` —
don't remove that header rule, or an updated service worker can take a very
long time to reach returning visitors' browsers.

---

## Final pre-launch testing checklist

Manual pass to run through before announcing launch (this repo has no
network access in this environment to run `npm install`/`next build`
itself, so treat this as the checklist to run once you have a real
environment with dependencies installed):

- [ ] `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
      completes with no errors.
- [ ] `npm run seed` against a fresh database, then log in as each seeded
      role (admin/teacher/student) and confirm the correct dashboard loads.
- [ ] As a student: browse `/courses`, enroll in a free course, open a
      lesson, mark it complete, take its quiz (both a passing and a failing
      attempt), and confirm points/streak update on `/dashboard`.
- [ ] As a student: enroll in a priced course with a
      [Paystack test card](https://paystack.com/docs/payments/test-payments/),
      confirm the webhook fires (check Paystack dashboard → webhook logs)
      and the course appears under "Your Courses".
- [ ] Complete every lesson in a course and confirm a certificate is issued,
      downloadable as a PDF, and verifiable at `/verify`.
- [ ] As a teacher: create a course, add a module/lesson, upload a PDF and a
      video attachment (confirm large files use the presigned path, not the
      50MB direct-upload route), add a quiz, and publish the course.
- [ ] As an admin: confirm the students/teachers/certificates/courses admin
      lists all load with real data.
- [ ] Try to access another student's data by guessing IDs in the URL
      (e.g. a lesson from a course you're not enrolled in) — every attempt
      should be rejected with a 403/404, not the actual content.
- [ ] Confirm WhatsApp notifications arrive (or fail silently and log to
      the console, if templates aren't approved yet) for enrollment,
      payment, and certificate events.
- [ ] Load the site on a phone, confirm the install prompt / "Add to Home
      Screen" works, and that the installed app opens to `/dashboard`.
- [ ] Turn on airplane mode after the app has loaded once — confirm the
      offline fallback page appears instead of a browser error.

---

## Security audit pass — fixes applied

A full manual review of every API route and lib file was done before this
launch (no build/test tooling was available to verify with `tsc`/`next
build` in that pass — re-run the "Final pre-launch testing checklist" above
for that). Fixed in place:

- **Critical: `GET /api/courses/:id` had no access control at all** and
  always returned full lesson content — video URLs, text, attachment
  file URLs — for *any* course, including unpublished drafts and courses
  the caller wasn't enrolled in/hadn't paid for. It now enforces the same
  published/ownership/enrollment rules the rest of the app uses, and strips
  lesson content down to an outline (titles only) for viewers who aren't
  entitled to it.
- `JWT_SECRET` missing *or* left as a known placeholder value (from
  `.env.example` or `docker-compose.yml`'s own default) now makes the app
  refuse to start in production, instead of silently signing sessions with
  a guessable secret.
- The Paystack webhook signature check used `===` string comparison
  (a timing side-channel); switched to `crypto.timingSafeEqual`.
- JSON-LD structured data (`app/layout.tsx`, `app/courses/[id]/page.tsx`)
  used `JSON.stringify` directly inside `dangerouslySetInnerHTML`, which
  doesn't escape `<` — a course title/description containing `</script>`
  could break out of the tag (stored XSS). Added `lib/json-ld.ts` and now
  escape through it in both places.
- Certificate number generation had a real (if small) collision chance
  against the `@unique certificateNo` column with no retry, which would
  have crashed the lesson-completion request with an unhandled error after
  points were already awarded. Now retries with a fresh number on
  collision.
- `Dockerfile` was missing `--chown=nextjs:nodejs` on the `public` folder
  copy, so the local-disk upload fallback (`public/uploads`) would fail
  with a permissions error for any self-hosted/Docker deployment not using
  S3 — the container runs as a non-root user. `docker-compose.yml` also had
  no volume for `public/uploads`, so uploads would be lost on every
  container recreation even once permissions were fixed.
- `next.config.js` allowed Next's image optimizer to fetch from *any*
  external host (`hostname: "**"`) — tightened to an explicit allowlist.
  Not currently exploitable (the app doesn't use `next/image` yet), but the
  `Course.thumbnailUrl` field already exists for that to be added later, so
  this closes the door before it's opened rather than after.
- A few routes (`POST /api/admin/teachers`, `POST /api/courses`) let a
  Prisma "record not found"/"unique constraint" error surface as an
  unhandled 500 instead of a clean 404/409. Fixed both.
- Documented (not fixed — needs a new dependency + font asset, out of scope
  for a polish pass) a real limitation in `lib/certificate-pdf.ts`: the
  standard PDF fonts used can't render Arabic script, so a student name or
  course title containing Arabic characters will throw. The API route now
  catches that and returns a clean error instead of crashing, but the real
  fix is embedding a Unicode font (e.g. Amiri, already used on the web UI)
  via `@pdf-lib/fontkit` before this matters for real users.

## What's already handled for production

- `output: "standalone"` in `next.config.js` for a minimal Docker image
- Security headers (HSTS, X-Frame-Options, nosniff, restrictive
  Permissions-Policy) in `next.config.js`
- Prisma binary targets for both serverless (`rhel-openssl-3.0.x`) and
  Docker/Alpine (`debian-openssl-3.0.x`) environments
- `robots.txt` and `sitemap.xml` (`app/robots.ts`, `app/sitemap.ts`) that
  disallow crawling `/dashboard`, `/admin`, `/teacher`, and `/api/`
- A GitHub Actions workflow (`.github/workflows/ci.yml`) that spins up a
  throwaway Postgres, runs migrations, lints, and builds on every push/PR
- Basic rate limiting on `/api/auth/login` and `/api/auth/register`
- SEO defaults (`metadataBase`, Open Graph/Twitter, JSON-LD organization +
  per-course schema) and a sitemap that includes every published course
- Paystack webhook signature verification (`lib/paystack.ts`) so payment
  confirmation can't be spoofed by posting fake webhook bodies
- Every third-party integration (Paystack, S3, WhatsApp) fails soft when
  unconfigured rather than crashing the build or the request
- Installable PWA (manifest + service worker) with conservative caching that
  never touches `/api/*`, plus a branded offline fallback page
