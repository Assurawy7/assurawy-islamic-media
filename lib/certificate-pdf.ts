import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

/**
 * KNOWN LIMITATION — non-Latin names/titles: the standard PDF fonts used
 * below (WinAnsi encoding) can only render Latin-script text (plus common
 * Latin-1 accents). On an Islamic education platform it's very plausible
 * for a student's name or a course title to contain Arabic script — pdf-lib
 * will throw ("WinAnsi cannot encode ...") the moment `drawText` hits an
 * unsupported character, which would otherwise surface as an unhandled 500.
 *
 * The route calling this (app/api/certificates/[id]/pdf/route.ts) wraps the
 * call in try/catch so that case fails as a clean error response instead of
 * crashing, but the real fix before relying on this for Arabic names is to
 * embed a Unicode-capable font (e.g. the Amiri font already loaded for the
 * web UI in app/layout.tsx) via `@pdf-lib/fontkit`:
 *
 *   import fontkit from "@pdf-lib/fontkit";
 *   doc.registerFontkit(fontkit);
 *   const amiri = await doc.embedFont(amiriTtfBytes); // fetch/bundle the .ttf
 *
 * That requires adding the `@pdf-lib/fontkit` package and a font file, which
 * this pass didn't add (no network access to fetch new dependencies/assets
 * in this environment) — tracked here so it isn't silently forgotten.
 */

type CertificateData = {
  studentName: string;
  courseTitle: string;
  certificateNo: string;
  issuedAt: Date;
};

// Brand colors, matched to the Tailwind theme (deep / gold / cream).
const DEEP = rgb(0.055, 0.231, 0.181); // #0E3B2E
const GOLD = rgb(0.776, 0.631, 0.357); // #C6A15B
const CREAM = rgb(0.973, 0.953, 0.906); // #F8F3E7
const INK = rgb(0.086, 0.149, 0.122); // #16261F

export async function generateCertificatePdf(data: CertificateData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([792, 612]); // US Letter, landscape
  const { width, height } = page.getSize();

  const serifBold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const serif = await doc.embedFont(StandardFonts.TimesRoman);
  const serifItalic = await doc.embedFont(StandardFonts.TimesRomanItalic);

  // Background
  page.drawRectangle({ x: 0, y: 0, width, height, color: CREAM });

  // Outer deep-green border
  const margin = 24;
  page.drawRectangle({
    x: margin,
    y: margin,
    width: width - margin * 2,
    height: height - margin * 2,
    borderColor: DEEP,
    borderWidth: 3,
  });

  // Inner gold border
  const innerMargin = 36;
  page.drawRectangle({
    x: innerMargin,
    y: innerMargin,
    width: width - innerMargin * 2,
    height: height - innerMargin * 2,
    borderColor: GOLD,
    borderWidth: 1.2,
  });

  const centerX = width / 2;
  const drawCentered = (
    text: string,
    y: number,
    font: typeof serif,
    size: number,
    color = INK
  ) => {
    const textWidth = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: centerX - textWidth / 2, y, size, font, color });
  };

  // Brand mark
  drawCentered("ASSURAWY ISLAMIC MEDIA", height - 90, serifBold, 16, DEEP);
  drawCentered("Designing Da'wah with Excellence", height - 110, serifItalic, 10, GOLD);

  // Small geometric divider
  page.drawLine({
    start: { x: centerX - 60, y: height - 128, },
    end: { x: centerX + 60, y: height - 128 },
    thickness: 1,
    color: GOLD,
  });

  // Title
  drawCentered("Certificate of Completion", height - 175, serifBold, 30, DEEP);

  // Body copy
  drawCentered("This is to certify that", height - 220, serif, 12);
  drawCentered(data.studentName, height - 255, serifBold, 24, DEEP);
  drawCentered("has successfully completed the course", height - 285, serif, 12);
  drawCentered(data.courseTitle, height - 318, serifBold, 18, DEEP);

  const dateStr = data.issuedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  drawCentered(`Completed on ${dateStr}`, height - 345, serifItalic, 11);

  // Footer: signature line + certificate ID
  const footerY = 110;
  page.drawLine({
    start: { x: 120, y: footerY },
    end: { x: 320, y: footerY },
    thickness: 1,
    color: DEEP,
  });
  page.drawText("Director, Assurawy Islamic Media", {
    x: 120,
    y: footerY - 16,
    size: 9,
    font: serif,
    color: INK,
  });

  const certLabel = `Certificate ID: ${data.certificateNo}`;
  const certWidth = serif.widthOfTextAtSize(certLabel, 10);
  page.drawText(certLabel, {
    x: width - 120 - certWidth,
    y: footerY - 2,
    size: 10,
    font: serif,
    color: INK,
  });
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://assurawy.org").replace(/^https?:\/\//, "");
  const verifyLabel = `Verify at ${siteUrl}/verify`;
  const verifyWidth = serifItalic.widthOfTextAtSize(verifyLabel, 9);
  page.drawText(verifyLabel, {
    x: width - 120 - verifyWidth,
    y: footerY - 16,
    size: 9,
    font: serifItalic,
    color: GOLD,
  });

  return doc.save();
}
