import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs/promises";
import path from "path";

type CertificateData = {
  studentName: string;
  courseTitle: string;
  certificateNo: string;
  issuedAt: Date;
};

// ===============================
// COLORS
// ===============================

const EMERALD = rgb(0.05, 0.28, 0.18);
const GOLD = rgb(0.79, 0.63, 0.27);
const LIGHT_GOLD = rgb(0.95, 0.88, 0.62);
const CREAM = rgb(0.985, 0.97, 0.93);
const TEXT = rgb(0.12, 0.12, 0.12);
const BLACK = rgb(0, 0, 0);

// ===============================
// PDF
// ===============================

export async function generateCertificatePdf(
  data: CertificateData
): Promise<Uint8Array> {

  const pdf = await PDFDocument.create();

  const page = pdf.addPage([842, 595]);

  const { width, height } = page.getSize();

  const titleFont = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const bodyFont = await pdf.embedFont(StandardFonts.TimesRoman);
  const italicFont = await pdf.embedFont(StandardFonts.TimesRomanItalic);

  // ===============================
  // LOAD LOGO
  // ===============================

  let logo: any = null;

  try {
    const logoBytes = await fs.readFile(
      path.join(
        process.cwd(),
        "public/images/certificate/logo.png"
      )
    );

    logo = await pdf.embedPng(logoBytes);

  } catch (e) {
    console.log("Logo not found");
  }

  // ===============================
  // LOAD SIGNATURE
  // ===============================

  let signature: any = null;

  try {

    const signBytes = await fs.readFile(
      path.join(
        process.cwd(),
        "public/images/certificate/signature.png"
      )
    );

    signature = await pdf.embedPng(signBytes);

  } catch (e) {

    console.log("Signature not found");

  }

  // ===============================
  // BACKGROUND
  // ===============================

  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: CREAM,
  });

  // ===============================
  // ISLAMIC PATTERN
  // ===============================

  for (let x = 25; x < width; x += 45) {

    for (let y = 25; y < height; y += 45) {

      page.drawCircle({

        x,

        y,

        size: 7,

        borderColor: LIGHT_GOLD,

        borderWidth: 0.4,

        opacity: 0.20,

      });

    }

  }

  // ===============================
  // BORDERS
  // ===============================

  page.drawRectangle({

    x: 18,

    y: 18,

    width: width - 36,

    height: height - 36,

    borderColor: EMERALD,

    borderWidth: 4,

  });

  page.drawRectangle({

    x: 34,

    y: 34,

    width: width - 68,

    height: height - 68,

    borderColor: GOLD,

    borderWidth: 1.5,

  });

  // ===============================
  // GOLD SEAL
  // ===============================

  page.drawCircle({

    x: width / 2,

    y: 150,

    size: 38,

    color: GOLD,

  });

  page.drawCircle({

    x: width / 2,

    y: 150,

    size: 31,

    borderColor: LIGHT_GOLD,

    borderWidth: 2,

  });

page.drawText("AIM", {
    x: width - 135,
    y: 142,
    font: titleFont,
    size: 12,
    color: CREAM,
});

  // ===============================
  // LOGO
  // ===============================

  if (logo) {

    page.drawImage(logo, {

      x: width / 2 - 45,

      y: height - 110,

      width: 90,

      height: 90,

    });

  }  // ===============================
  // HELPER
  // ===============================

  const center = width / 2;

  function drawCentered(
    text: string,
    y: number,
    font: any,
    size: number,
    color = TEXT
  ) {
    const w = font.widthOfTextAtSize(text, size);

    page.drawText(text, {
      x: center - w / 2,
      y,
      font,
      size,
      color,
    });
  }

  // ===============================
  // ARABIC HEADER
  // ===============================

  drawCentered(
    "",
    height - 35,
    italicFont,
    12,
    GOLD
  );

  // ===============================
  // BRAND
  // ===============================

  drawCentered(
    "ASSURAWY ISLAMIC MEDIA",
    height - 130,
    titleFont,
    20,
    EMERALD
  );

  drawCentered(
    "Designing Da'wah with Excellence",
    height - 150,
    italicFont,
    11,
    GOLD
  );

  page.drawLine({
    start: {
      x: center - 90,
      y: height - 165,
    },
    end: {
      x: center + 90,
      y: height - 165,
    },
    thickness: 1,
    color: GOLD,
  });

  // ===============================
  // TITLE
  // ===============================

  drawCentered(
    "CERTIFICATE OF COMPLETION",
    height - 215,
    titleFont,
    30,
    EMERALD
  );

  drawCentered(
    "This Certificate is Proudly Presented To",
    height - 245,
    italicFont,
    12
  );

  // ===============================
  // STUDENT NAME
  // ===============================

  drawCentered(
    data.studentName.toUpperCase(),
    height - 285,
    titleFont,
    26,
    EMERALD
  );

  page.drawLine({
    start: {
      x: 200,
      y: height - 292,
    },
    end: {
      x: width - 200,
      y: height - 292,
    },
    thickness: 1,
    color: GOLD,
  });

  drawCentered(
    " Alhamdulillah For Successfully Completing The Course",
    height - 325,
    bodyFont,
    12
  );

  drawCentered(
    data.courseTitle,
    height - 355,
    titleFont,
    18,
    EMERALD
  );

  const issued = data.issuedAt.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  drawCentered(
    `Issued on ${issued}`,
    height - 385,
    italicFont,
    11,
    GOLD
  );  // ===============================
  // SIGNATURE
  // ===============================

  if (signature) {
  page.drawImage(signature, {
    x: 130,
    y: 120,
    width: 140,
    height: 60,
  });
}

  page.drawLine({
    start: { x: 110, y: 100 },
    end: { x: 290, y: 100 },
    thickness: 1,
    color: EMERALD,
  });

  page.drawText("Director", {
    x: 170,
    y: 82,
    font: bodyFont,
    size: 10,
    color: TEXT,
  });

  page.drawText("Assurawy Islamic Media", {
    x: 125,
    y: 68,
    font: italicFont,
    size: 9,
    color: GOLD,
  });

  // ===============================
  // CERTIFICATE ID
  // ===============================

  const certText = `Certificate ID: ${data.certificateNo}`;

  page.drawText(certText, {
    x: width - 260,
    y: 105,
    font: bodyFont,
    size: 12,
    color: TEXT,
  });

  page.drawText("Verified by Assurawy Islamic Media", {
    x: width - 260,
    y: 88,
    font: italicFont,
    size: 9,
    color: GOLD,
  });

  // ===============================
  // GOLD SEAL TEXT
  // ===============================

  page.drawText("", {
    x: width - 120,
    y: 112,
    font: titleFont,
    size: 8,
    color: EMERALD,
  });

  page.drawText("", {
    x: width - 140,
    y: 95,
    font: bodyFont,
    size: 9,
    color: EMERALD,
  });

  // ===============================
  // FOOTER
  // ===============================

  page.drawLine({
    start: { x: 60, y: 45 },
    end: { x: width - 60, y: 45 },
    thickness: 0.8,
    color: GOLD,
  });

  page.drawText(
    "© Assurawy Islamic Media • Designing Da'wah with Excellence",
    {
      x: 180,
      y: 28,
      font: italicFont,
      size: 8,
      color: BLACK,
    }
  );

  return await pdf.save();
}