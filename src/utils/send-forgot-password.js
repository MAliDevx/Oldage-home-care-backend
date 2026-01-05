const nodemailer = require("nodemailer");

async function sendEmail(to, subject, message) {
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SYSTEM_EMAIL,
      pass: process.env.SYSTEM_EMAIL_PASSWORD,
    }
  });

  await transporter.sendMail({
    from: "Node Auth <m13ali1000@gmail.com>",
    to,
    subject,
    text: message
  });
}

module.exports = sendEmail;
