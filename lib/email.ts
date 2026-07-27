import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // ko host dinka
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App password daga Gmail
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: any[];
}

export async function sendNotificationEmail({ to, subject, html, attachments }: EmailOptions) {
  try {
    await transporter.sendMail({
      from: `"Kwas da Karatu" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    });
    console.log("An tura i-mel cikin nasara zuwa:", to);
  } catch (error) {
    console.error("Kuskure wajen tura i-mel:", error);
  }
}