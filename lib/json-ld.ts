/**
 * Safely serializes an object for embedding inside a `<script type="application/ld+json">`
 * tag via `dangerouslySetInnerHTML`.
 *
 * `JSON.stringify` alone does NOT escape "<", so if any field ever contains
 * user-generated content (a course title/description written by a teacher,
 * for example) with a literal `</script>`, it can close the script tag early
 * and inject arbitrary HTML/JS into the page — a stored XSS vector. Escaping
 * "<" as a unicode escape neutralizes that without changing the JSON-LD's
 * meaning (JSON-LD consumers parse the unescaped JSON string just fine).
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
