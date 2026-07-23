export function TestimonialCard({
  name,
  location,
  quote,
}: {
  name: string;
  location: string;
  quote: string;
}) {
  return (
    <figure className="rounded-xl2 bg-white p-6 shadow-card">
      <span className="font-display text-3xl text-gold">&ldquo;</span>
      <blockquote className="text-sm leading-relaxed text-ink/80">
        {quote}
      </blockquote>
      <figcaption className="mt-4 border-t border-deep/10 pt-3 text-sm">
        <span className="font-semibold text-deep">{name}</span>
        <span className="text-ink/50"> · {location}</span>
      </figcaption>
    </figure>
  );
}

export function ArticleCard({
  title,
  category,
  excerpt,
  readTime,
}: {
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
}) {
  return (
    <article className="flex flex-col rounded-xl2 border border-deep/10 bg-white p-6 shadow-card">
      <span className="text-xs font-semibold uppercase tracking-wide text-gold">
        {category}
      </span>
      <h3 className="mt-2 font-display text-lg font-semibold text-deep">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">
        {excerpt}
      </p>
      <p className="mt-4 text-xs text-ink/45">{readTime} read</p>
    </article>
  );
}
