import Link from "next/link";
import CourseCard, { Course } from "@/components/CourseCard";
import { TestimonialCard, ArticleCard } from "@/components/Cards";

const featuredCourses: Course[] = [
  {
    slug: "fiqh-101",
    title: "Introduction to Fiqh",
    instructor: "Ustadh Ibrahim Sani",
    level: "Foundational",
    modules: 4,
    lessons: 22,
    description:
      "A structured path through Taharah, Salah, Zakah and Fasting, drawn from the classical texts of the four madhahib.",
  },
  {
    slug: "seerah-101",
    title: "Seerah of Prophet Muhammad ﷺ",
    instructor: "Ustadha Maryam Bello",
    level: "Foundational",
    modules: 5,
    lessons: 30,
    description:
      "From Birth to the Madinah period — a chronological journey through the life of the final Messenger.",
  },
  {
    slug: "tarbiyyah-101",
    title: "Islamic Tarbiyyah",
    instructor: "Ustadh Yusuf Danladi",
    level: "All Levels",
    modules: 4,
    lessons: 18,
    description:
      "Good character, patience, truthfulness and respect for parents — practical tarbiyyah for daily life.",
  },
];

const reasons = [
  {
    title: "Sanad-Based Curriculum",
    text: "Every course traces its content back through a clear chain of classical sources — nothing improvised.",
  },
  {
    title: "Qualified Teachers",
    text: "Instructors hold verified ijazat and years of teaching experience across Fiqh, Tafseer and Qira'ah.",
  },
  {
    title: "Learn at Your Own Pace",
    text: "Lessons, PDFs and quizzes stay open on your dashboard — revisit any module whenever you need to.",
  },
  {
    title: "Certified Completion",
    text: "Finish a course and receive a verifiable Assurawy certificate with a unique certificate ID.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-deep text-cream">
        <div
          className="absolute inset-0 opacity-40"
          style={{ backgroundImage: "url('/arabesque.svg')", backgroundSize: "220px" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <p className="font-arabic text-xl text-gold/90">بسم الله الرحمن الرحيم</p>
          <h1 className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-tight md:text-6xl">
            Learn Islam Anywhere,
            <span className="text-gold"> Anytime</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-cream/80">
            Structured Qur&apos;an, Fiqh, Seerah, Tafseer and Hadith courses,
            built like a traditional sanad and delivered through a modern
            online academy.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/courses"
              className="focus-ring rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-deep transition hover:bg-goldLight"
            >
              Start Learning
            </Link>
            <Link
              href="/register"
              className="focus-ring rounded-full border border-cream/40 px-7 py-3.5 text-sm font-semibold text-cream transition hover:border-gold hover:text-gold"
            >
              Register Now
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">
              Featured Courses
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-deep">
              Begin your path of knowledge
            </h2>
          </div>
          <Link href="/courses" className="focus-ring text-sm font-semibold text-emerald hover:text-deep">
            View all courses →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featuredCourses.map((c) => (
            <CourseCard key={c.slug} course={c} />
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-parchment py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold">
            Why Assurawy
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-deep">
            Why students choose Assurawy Islamic Media
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <div key={r.title}>
                <div className="mb-4 h-1 w-10 rounded-full bg-gold" />
                <h3 className="font-display text-lg font-semibold text-deep">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  {r.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold">
          Student Voices
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-deep">
          What our students say
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <TestimonialCard
            name="Aisha Bello"
            location="Kano"
            quote="The Fiqh course gave me a clarity I never had — every ruling was explained with its source, not just memorized."
          />
          <TestimonialCard
            name="Muhammad Sani"
            location="Kaduna"
            quote="I finally understood the Seerah as one connected story instead of scattered stories I'd heard growing up."
          />
          <TestimonialCard
            name="Zainab Aliyu"
            location="Abuja"
            quote="The Qur'an Academy's tajweed feedback helped me correct mistakes I'd been making for years."
          />
        </div>
      </section>

      {/* LATEST ARTICLES */}
      <section className="bg-sand py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                From the Blog
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-deep">
                Latest Islamic articles
              </h2>
            </div>
            <Link href="/articles" className="focus-ring text-sm font-semibold text-emerald hover:text-deep">
              Read all articles →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <ArticleCard
              category="Tarbiyyah"
              title="Raising Children on the Sunnah in a Digital Age"
              excerpt="Practical guidance for instilling Islamic values at home while navigating modern technology."
              readTime="6 min"
            />
            <ArticleCard
              category="Fiqh"
              title="Understanding the Wisdom Behind Zakah"
              excerpt="A look at how Zakah purifies wealth and strengthens the social fabric of the Ummah."
              readTime="5 min"
            />
            <ArticleCard
              category="Seerah"
              title="Lessons from the Hijrah for Times of Hardship"
              excerpt="What the migration to Madinah teaches us about patience, planning and trust in Allah."
              readTime="7 min"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-deep py-20 text-cream">
        <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">
            Ready to begin your journey of Islamic knowledge?
          </h2>
          <p className="mt-4 text-cream/75">
            Join thousands of students learning Qur&apos;an, Fiqh, Seerah and
            more with Assurawy Islamic Media.
          </p>
          <Link
            href="/register"
            className="focus-ring mt-8 inline-block rounded-full bg-gold px-8 py-4 text-sm font-semibold text-deep transition hover:bg-goldLight"
          >
            Register Now
          </Link>
        </div>
      </section>
    </>
  );
}
