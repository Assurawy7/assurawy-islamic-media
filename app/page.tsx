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
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#0B132B] text-slate-100 py-24 md:py-32 border-b border-[#D4AF37]/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8 text-center md:text-left">
          <p className="font-serif text-xl font-bold text-[#F5D77F] tracking-widest drop-shadow-md">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl font-bold leading-tight text-white md:text-6xl">
            Learn Islam Anywhere,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#8C6D1F]">
              Anytime
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-300 leading-relaxed">
            Structured Qur&apos;an, Fiqh, Seerah, Tafseer and Hadith courses,
            built like a traditional sanad and delivered through a modern digital academy.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center md:justify-start">
            <Link
              href="/courses"
              className="rounded-xl bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#8C6D1F] px-8 py-3.5 text-sm font-bold text-[#0B132B] shadow-lg hover:brightness-110 active:scale-95 transition"
            >
              Start Learning
            </Link>
            <Link
              href="/register"
              className="rounded-xl border border-[#D4AF37]/40 px-8 py-3.5 text-sm font-semibold text-[#F5D77F] hover:bg-[#D4AF37]/10 transition"
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
            <p className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
              Featured Courses
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-white">
              Begin Your Path of Knowledge
            </h2>
          </div>
          <Link href="/courses" className="text-sm font-semibold text-[#F5D77F] hover:underline">
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
      <section className="bg-[#060B1E] py-20 border-y border-[#D4AF37]/10">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
            Why Assurawy
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-white">
            Why Students Choose Assurawy Academy
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <div key={r.title} className="p-6 rounded-2xl bg-[#0B132B] border border-[#D4AF37]/20 shadow-md">
                <div className="mb-4 h-1 w-10 rounded-full bg-[#D4AF37]" />
                <h3 className="font-serif text-lg font-bold text-[#F5D77F]">
                  {r.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {r.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
          Student Voices
        </p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-white">
          What Our Students Say
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
      <section className="bg-[#060B1E] py-20 border-t border-[#D4AF37]/10">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
                From the Blog
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-white">
                Latest Islamic Articles
              </h2>
            </div>
            <Link href="/articles" className="text-sm font-semibold text-[#F5D77F] hover:underline">
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

      {/* CALL TO ACTION */}
      <section className="bg-gradient-to-br from-[#0B132B] via-[#1C2541] to-[#060B1E] py-20 text-center border-t border-[#D4AF37]/20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h2 className="font-serif text-3xl font-bold text-white md:text-4xl">
            Ready to Begin Your Journey of Islamic Knowledge?
          </h2>
          <p className="mt-4 text-slate-300 text-sm">
            Join thousands of students learning Qur&apos;an, Fiqh, Seerah and more with Assurawy Islamic Media.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-xl bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#8C6D1F] px-8 py-4 text-sm font-bold text-[#0B132B] shadow-lg hover:brightness-110 transition"
          >
            Register Now
          </Link>
        </div>
      </section>
    </>
  );
}