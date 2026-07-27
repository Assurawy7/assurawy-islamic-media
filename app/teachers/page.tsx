export const metadata = { title: "Teachers — Assurawy Islamic Media" };
export const dynamic = 'force-dynamic';
const teachers = [
  { name: "Ustadh Ibrahim Sani", role: "Fiqh & Usul al-Fiqh", bio: "Over 12 years teaching Fiqh, with ijazah in the Maliki school and a background in Shari'ah studies." },
  { name: "Ustadha Maryam Bello", role: "Seerah & Islamic History", bio: "Specializes in Seerah studies and the early history of the Muslim community, with a focus on primary sources." },
  { name: "Ustadh Yusuf Danladi", role: "Tarbiyyah & Akhlaq", bio: "Focuses on character development and practical application of Islamic ethics in daily life." },
  { name: "Ustadh Abdulkarim Musa", role: "Tafseer & Qur'anic Sciences", bio: "Trained in the classical sciences of Tafseer, with ijazah in several works of Qur'anic exegesis." },
  { name: "Ustadha Zainab Kabir", role: "Qur'an & Tajweed", bio: "Certified in Qira'ah, leading the Qur'an Academy's recitation and tajweed review." },
  { name: "Ustadh Hamza Aliyu", role: "Hadith Sciences", bio: "Teaches hadith terminology and authentication methodology alongside applied hadith studies." },
];

export default function TeachersPage() {
  return (
    <>
      <section className="bg-deep py-16 text-cream">
        <div className="mx-auto max-w-4xl px-5 text-center md:px-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold">Teachers</p>
          <h1 className="mt-3 font-display text-4xl font-semibold">Meet Our Instructors</h1>
          <p className="mx-auto mt-4 max-w-2xl text-cream/80">
            Qualified teachers with verified ijazat, guiding every course and every student.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((t) => (
            <div key={t.name} className="rounded-xl2 border border-deep/10 bg-white p-6 shadow-card">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald/10 font-display text-lg font-semibold text-emerald">
                {t.name.split(" ").slice(-1)[0].charAt(0)}
              </div>
              <h3 className="font-display text-lg font-semibold text-deep">{t.name}</h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gold">{t.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{t.bio}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
