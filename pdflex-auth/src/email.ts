import nodemailer from "nodemailer";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "no-reply@pdflex.local";

let transporterPromise: Promise<nodemailer.Transporter> | undefined;

function getTransporter(): Promise<nodemailer.Transporter> {
  if (transporterPromise) return transporterPromise;

  if (SENDGRID_API_KEY) {
    transporterPromise = Promise.resolve(
      nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 587,
        secure: false,
        auth: { user: "apikey", pass: SENDGRID_API_KEY },
      })
    );
  } else {
    transporterPromise = nodemailer.createTestAccount().then((acct) =>
      nodemailer.createTransport({
        host: acct.smtp.host,
        port: acct.smtp.port,
        secure: acct.smtp.secure,
        auth: { user: acct.user, pass: acct.pass },
      })
    );
  }

  return transporterPromise;
}

export async function sendEmail(to: string, subject: string, html: string, text?: string) {
  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject,
    html,
    text,
  });

  const preview = (nodemailer as any).getTestMessageUrl?.(info);
  if (preview) {
    console.log(`📬 Ethereal preview: ${preview}`);
  }

  console.log(`✉️  Email sent to ${to} (id: ${info.messageId})`);
  return info;
}