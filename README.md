# Assurawy Islamic Media — Frontend

Next.js 14 (App Router) + TypeScript + Tailwind CSS frontend for the
Assurawy Islamic Media online learning platform.

## What's included

- **Public site:** Home, About, Courses, Qur'an Academy, Articles, Teachers, Contact
- **Auth pages:** Register, Login (UI only — wire up to your backend/API)
- **Student Dashboard:** enrolled courses with progress bars, quiz scores, certificates
- Shared `Navbar` / `Footer`, `CourseCard`, `ArticleCard`, `TestimonialCard`
- Custom Tailwind theme: deep emerald / gold / cream Islamic palette, Fraunces
  (display) + Inter (body) + Amiri (Arabic) fonts, a geometric-star divider,
  and a "sanad chain" module list used on the Courses page

- **Backend:** Next.js Route Handlers under `app/api/*`, Prisma ORM, PostgreSQL
- **Auth:** email/password with bcrypt hashing, JWT session stored in an
  httpOnly cookie, edge `middleware.ts` protecting `/dashboard`, `/admin`,
  and `/teacher` by role (STUDENT / TEACHER / ADMIN)
- Register and Login pages are wired to the real `/api/auth/*` endpoints

- **Admin Dashboard** (`/admin`): overview stats, course list with
  publish/unpublish/delete, student directory, teacher directory with a
  "promote student to teacher" flow, certificate search + revoke, and an
  announcements composer.
- **Teacher Dashboard** (`/teacher`): overview stats, course list, a course
  creation form, and a full **Course Manager** (`/teacher/courses/:id`) for
  building out a course:
  - Add/delete **modules** and **lessons** (title, notes, video URL)
  - **PDF upload** per lesson (drag a file in, it uploads to `/api/uploads`
    and attaches itself to the lesson — remove attachments just as easily)
  - A **Quiz Builder** (`/teacher/lessons/:id/quiz`) for adding
    multiple-choice or short-answer questions, setting the passing score,
    and editing/deleting an existing quiz
  - **Student Analytics** (`/teacher/courses/:id/analytics`): per-student
    progress, lessons completed, and average quiz score for that course
- Both dashboards share a responsive **sidebar shell**
  (`components/dashboard/Sidebar.tsx`) — fixed on desktop, a slide-in drawer
  with an overlay on mobile — built on the same Islamic green/gold theme as
  the public site.

- **Payments (Paystack):** priced courses checkout through Paystack
  (`lib/paystack.ts`), with a `Payment` model, an initialize → redirect →
  verify flow (`/api/payments/initialize`, `/payment/callback`,
  `/api/payments/verify`), and a webhook (`/api/payments/webhook`) as the
  server-to-server source of truth. Free courses skip payment entirely. A
  real course detail page (`/courses/:id`) renders the enroll/pay button
  against live data.
- **Cloud file storage:** `lib/storage.ts` supports any S3-compatible
  provider (AWS S3, Cloudflare R2, Supabase Storage, …) for lesson PDFs and
  videos, via either a simple upload route (`/api/uploads`) or a presigned
  direct-to-storage upload (`/api/uploads/presign`) for large video files.
  Falls back to local disk when cloud storage isn't configured.
- **Gamification:** points (lesson/quiz/course completion), a daily
  learning streak, and an auto-awarded badge system (`lib/gamification.ts`),
  surfaced on the student dashboard (`GamificationPanel`) and a
  `/dashboard/leaderboard` page. Backed by `/api/gamification/me` and
  `/api/gamification/leaderboard`.
- **WhatsApp notifications:** `lib/whatsapp.ts` sends enrollment,
  payment-success, and certificate-issued messages via the WhatsApp
  Business Cloud API (Meta) — fails soft (logs, never throws) if not
  configured, and needs pre-approved message templates in production (see
  the file's docstring).
- **SEO:** `metadataBase`, Open Graph/Twitter defaults, and a JSON-LD
  `EducationalOrganization` schema in the root layout; per-course JSON-LD
  `Course`/`Offer` schema and canonical URLs; a dynamic sitemap that
  includes every published course.
- **Islamic visual polish:** a reusable geometric eight-pointed-star pattern
  strip (`components/IslamicPattern.tsx`) applied across the Admin/Teacher
  dashboard shells and the certificate verification page, plus Arabic
  typographic accents.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full guide — Vercel + managed
Postgres (recommended) or self-hosted Docker, environment variables,
migrations, and a post-deploy checklist.

## Getting started (local development)

1. Copy the environment file and fill in your own values:
   ```bash
   cp .env.example .env
   ```
   - `DATABASE_URL` — your PostgreSQL connection string
   - `JWT_SECRET` — generate one with `openssl rand -base64 32`

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the database tables and generate the Prisma client:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Seed an admin, a teacher, a student, and one full example course:
   ```bash
   npm run seed
   ```
   Seeded logins (all use the same password `Password123!`):
   - `admin@assurawy.org` — Admin
   - `ibrahim.sani@assurawy.org` — Teacher
   - `fatima@example.com` — Student

5. Start the dev server:
   ```bash
   npm run dev
   ```

Open http://localhost:3000

## Auth & roles

- `POST /api/auth/register` — create a Student account, sets session cookie
- `POST /api/auth/login` — verify credentials, sets session cookie
- `POST /api/auth/logout` — clears the session cookie
- `GET /api/auth/me` — returns the current session's user

Sessions are signed JWTs (via `jose`, edge-compatible) stored in an httpOnly
cookie named `assurawy_session`. `middleware.ts` checks the role on every
request to `/dashboard/*`, `/admin/*`, and `/teacher/*` and redirects to
`/login` if the role doesn't match.

## API reference

| Method | Route | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create student account |
| POST | `/api/auth/login` | Public | Log in |
| POST | `/api/auth/logout` | Public | Log out |
| GET | `/api/auth/me` | Authenticated | Current user |
| GET | `/api/courses` | Public | List published courses |
| POST | `/api/courses` | Teacher/Admin | Create a course |
| GET | `/api/courses/:id` | Public | Full course + modules + lessons |
| PATCH | `/api/courses/:id` | Teacher (own)/Admin | Update a course |
| DELETE | `/api/courses/:id` | Admin | Delete a course |
| POST | `/api/courses/:id/enroll` | Student | Enroll in a course |
| GET | `/api/enrollments` | Student | My courses with computed progress |
| POST | `/api/lessons/:id/complete` | Student (enrolled) | Mark a lesson complete; auto-issues a certificate on course completion |
| GET | `/api/quizzes/:id` | Authenticated | Fetch quiz questions (answers stripped) |
| POST | `/api/quizzes/:id/submit` | Authenticated | Submit answers, auto-graded |
| GET | `/api/certificates` | Student | My certificates |
| GET | `/api/certificates/:certificateNo` | Public | Verify a certificate by its number |
| GET | `/api/certificates/:certificateNo/pdf` | Public | Download the branded certificate as a PDF |
| GET | `/api/admin/students` | Admin | List all students |
| GET/POST | `/api/admin/teachers` | Admin | List teachers / promote a user to Teacher |
| GET | `/api/admin/courses` | Admin | List every course (any publish status) |
| GET | `/api/admin/certificates` | Admin | List/search all issued certificates |
| DELETE | `/api/admin/certificates/:id` | Admin | Revoke a certificate |
| GET | `/api/teacher/courses` | Teacher/Admin | Teacher's own courses (any publish status) |
| POST | `/api/courses/:id/modules` | Teacher (own)/Admin | Add a module to a course |
| PATCH/DELETE | `/api/modules/:id` | Teacher (own)/Admin | Rename/reorder or delete a module |
| POST | `/api/modules/:id/lessons` | Teacher (own)/Admin | Add a lesson to a module |
| PATCH/DELETE | `/api/lessons/:id` | Teacher (own)/Admin | Edit or delete a lesson |
| POST | `/api/uploads` | Teacher/Admin | Upload a PDF/video file, returns its URL (dev/self-hosted — see note below) |
| POST | `/api/lessons/:id/attachments` | Teacher (own)/Admin | Attach an uploaded file to a lesson |
| DELETE | `/api/attachments/:id` | Teacher (own)/Admin | Remove an attachment |
| GET/POST | `/api/lessons/:id/quiz` | Teacher (own)/Admin | Fetch (with answers) or create the lesson's quiz |
| PATCH/DELETE | `/api/quizzes/:id` | Teacher (own)/Admin | Edit (replaces all questions) or delete a quiz |
| GET | `/api/courses/:id/analytics` | Teacher (own)/Admin | Per-student progress + quiz averages for a course |
| GET/POST | `/api/announcements` | Public read / Teacher+Admin write | Site announcements |
| POST | `/api/payments/initialize` | Student | Enrolls directly if the course is free, otherwise starts a Paystack transaction |
| GET | `/api/payments/verify` | Public (reads `?reference=`) | Confirms a transaction after the Paystack redirect, enrolls the student |
| POST | `/api/payments/webhook` | Paystack only (signature-verified) | Server-to-server payment confirmation — the source of truth |
| POST | `/api/uploads/presign` | Teacher/Admin | Presigned direct-to-cloud-storage upload URL, for large video files |
| GET | `/api/gamification/me` | Student | Points, streak, and earned badges |
| GET | `/api/gamification/leaderboard` | Authenticated | Top 20 students by points |

**Note on `/api/uploads`:** when `S3_*` env vars are set (see `.env.example`)
it uploads to your S3-compatible bucket via `lib/storage.ts`. Otherwise it
falls back to writing into `public/uploads` on the local filesystem, which
only works when the app runs as a long-lived process (self-hosted/Docker) —
not on serverless platforms like Vercel, where the filesystem is ephemeral.
Configure cloud storage before enabling uploads in a Vercel deployment, and
prefer `/api/uploads/presign` for anything larger than a few MB.

## Database schema

Defined in `prisma/schema.prisma`: `User` (role enum: ADMIN/TEACHER/STUDENT;
also carries `phone`, and gamification fields `points`/`currentStreak`/
`longestStreak`/`lastActivityAt`), `Course` (with `priceKobo` for Paystack
pricing) → `Module` → `Lesson` → `Attachment`, `Quiz` → `Question`,
`Enrollment`, `LessonProgress`, `QuizAttempt`, `Certificate`,
`MemorizationEntry` and `Recitation` (for the Qur'an Academy),
`ForumPost`/`ForumComment`/`Announcement` for the community features, and
`Payment` (Paystack transactions) / `Badge` / `UserBadge` (gamification).

## Folder structure

```
app/
  layout.tsx        Root layout, fonts, Navbar/Footer, SEO defaults + JSON-LD
  page.tsx           Home page
  about/page.tsx
  courses/page.tsx
  courses/[id]/page.tsx  Real course detail page + enroll/pay button
  quran-academy/page.tsx
  articles/page.tsx
  teachers/page.tsx
  contact/page.tsx
  register/page.tsx
  login/page.tsx
  verify/page.tsx    Public certificate verification
  payment/callback/page.tsx  Paystack redirect target
  dashboard/page.tsx Student dashboard (+ gamification panel)
  dashboard/leaderboard/page.tsx
  admin/             Admin dashboard (layout + overview, courses, students,
                     teachers, certificates, announcements)
  teacher/           Teacher dashboard (layout + overview, courses, course
                     manager, quiz builder, analytics, announcements)
  api/               All Route Handlers — see API reference above
  sitemap.ts, robots.ts
  globals.css
components/
  Navbar.tsx
  Footer.tsx
  CourseCard.tsx
  Cards.tsx          TestimonialCard, ArticleCard
  EnrollButton.tsx   Free-enroll or Paystack-checkout button
  IslamicPattern.tsx Geometric star-strip decorative accent
  dashboard/
    Sidebar.tsx        Responsive sidebar shell (desktop fixed / mobile drawer)
    UI.tsx             StatCard, ProgressBar, Badge
    CourseForm.tsx     Shared course-creation form (incl. price)
    AnnouncementsManager.tsx
    GamificationPanel.tsx  Points/streak/badges on the student dashboard
lib/
  prisma.ts, auth.ts, session.ts, course-access.ts, rate-limit.ts,
  certificate-pdf.ts, paystack.ts, payment-fulfillment.ts, storage.ts,
  gamification.ts, whatsapp.ts
public/
  arabesque.svg      Geometric background pattern
  uploads/           Local file storage for /api/uploads (dev/self-hosted)
```

## Still to do

1. **Launch blocker:** there is no student-facing "watch lesson" page yet
   (video player + PDF viewer + a "mark complete" button calling
   `POST /api/lessons/:id/complete`). `GET /api/lessons/:id` already exists
   and is correctly enrollment-gated (see its docstring), and completion is
   fully wired into gamification/certificates — but with no page in
   `app/dashboard/*` that actually calls it, an enrolled student has no UI
   path to view lesson content or mark it complete today. This is core LMS
   functionality, not a nice-to-have — build this before announcing launch.
2. Replace the remaining static arrays with real data: the Home page's
   "featured courses" section (`app/page.tsx`), `app/teachers/page.tsx`, and
   `app/articles/page.tsx` all still hardcode arrays. (`/courses` and
   `/courses/:id` are already fully live, querying Prisma directly — no
   change needed there.)
3. Wire up the Qur'an Academy's memorization tracker and recitation
   submission/feedback flow — the `MemorizationEntry` and `Recitation`
   models already exist, but there's no API or UI for them yet.
4. Register the WhatsApp message templates in Meta Business Manager
   (`enrollment_confirmation`, `certificate_issued`, `payment_success`) —
   `lib/whatsapp.ts` assumes these names; Meta requires template approval
   before they can be sent outside a live conversation.
5. Add a real Open Graph image (`public/og-image.png`, 1200×630) and wire it
   back into the `openGraph`/`twitter` metadata in `app/layout.tsx` — it was
   left out rather than shipping a broken image reference.
6. Set up a Paystack webhook in the dashboard pointing at
   `/api/payments/webhook`, and test the full checkout with a live (not
   test-mode) key pair before accepting real payments.

Certificate PDFs are already generated with `pdf-lib` (`lib/certificate-pdf.ts`,
downloadable at `/api/certificates/:certificateNo/pdf`), and there's a public
`/verify` page for checking a certificate number.
