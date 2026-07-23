import { ArticleCard } from "@/components/Cards";

export const metadata = { title: "Islamic Articles — Assurawy Islamic Media" };

const articles = [
  { category: "Tarbiyyah", title: "Raising Children on the Sunnah in a Digital Age", excerpt: "Practical guidance for instilling Islamic values at home while navigating modern technology.", readTime: "6 min" },
  { category: "Fiqh", title: "Understanding the Wisdom Behind Zakah", excerpt: "A look at how Zakah purifies wealth and strengthens the social fabric of the Ummah.", readTime: "5 min" },
  { category: "Seerah", title: "Lessons from the Hijrah for Times of Hardship", excerpt: "What the migration to Madinah teaches us about patience, planning and trust in Allah.", readTime: "7 min" },
  { category: "Tafseer", title: "The Opening of Surah Al-Baqarah: An Overview", excerpt: "Exploring the early verses that describe the believers, disbelievers and hypocrites.", readTime: "8 min" },
  { category: "Hadith", title: "The Hadith of Intentions and Its Everyday Application", excerpt: "Why 'actions are judged by intentions' reshapes how we approach daily tasks.", readTime: "4 min" },
  { category: "Tarbiyyah", title: "Teaching Patience Through the Stories of the Prophets", excerpt: "How Qur'anic narratives model sabr for both children and adults.", readTime: "6 min" },
];

export default function ArticlesPage() {
  return (
    <>
      <section className="bg-deep py-16 text-cream">
        <div className="mx-auto max-w-4xl px-5 text-center md:px-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold">Articles</p>
          <h1 className="mt-3 font-display text-4xl font-semibold">Islamic Articles</h1>
          <p className="mx-auto mt-4 max-w-2xl text-cream/80">
            Short, sourced reflections on Fiqh, Seerah, Tafseer, Hadith and Tarbiyyah.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.title} {...a} />
          ))}
        </div>
      </section>
    </>
  );
}
