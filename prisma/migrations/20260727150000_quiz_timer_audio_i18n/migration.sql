-- Quiz timer, lesson audio, and multi-language support

-- User: language preference + WhatsApp opt-in
ALTER TABLE "User" ADD COLUMN "language" TEXT NOT NULL DEFAULT 'ha';
ALTER TABLE "User" ADD COLUMN "whatsappOptIn" BOOLEAN NOT NULL DEFAULT true;

-- Lesson: audio recording URL
ALTER TABLE "Lesson" ADD COLUMN "audioUrl" TEXT;

-- Quiz: optional time limit (minutes). NULL = untimed.
ALTER TABLE "Quiz" ADD COLUMN "timeLimitMinutes" INTEGER;

-- QuizAttempt: track how long the student took and whether the timer
-- auto-submitted the attempt for them.
ALTER TABLE "QuizAttempt" ADD COLUMN "timeTakenSeconds" INTEGER;
ALTER TABLE "QuizAttempt" ADD COLUMN "autoSubmitted" BOOLEAN NOT NULL DEFAULT false;

-- SiteSettings: fields the admin settings form already collects but the
-- schema was missing (the form has been silently failing to save these).
ALTER TABLE "SiteSettings" ADD COLUMN "supportEmail" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN "emailNotifications" BOOLEAN NOT NULL DEFAULT true;
