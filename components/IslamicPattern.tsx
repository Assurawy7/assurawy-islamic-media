/**
 * A thin repeating eight-pointed star band, used as a premium decorative
 * accent under page headers/hero banners. Pure inline SVG (no image
 * request), so it tints correctly against any background via `currentColor`.
 */
export default function IslamicPattern({
  className = "",
  color = "text-gold/50",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      className={`h-3 w-full ${color} ${className}`}
      viewBox="0 0 240 12"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <pattern id="aim-star-strip" width="24" height="12" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="0.8">
            <path d="M12 1 L14.2 5.2 L18.8 5.2 L15.3 8 L16.8 12 L12 9.4 L7.2 12 L8.7 8 L5.2 5.2 L9.8 5.2 Z" />
          </g>
        </pattern>
      </defs>
      <rect width="240" height="12" fill="url(#aim-star-strip)" />
    </svg>
  );
}
