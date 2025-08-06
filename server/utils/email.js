require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmail = async ({
  email,
  subject,
  message,
  name,
  buttonText,
  link,
}) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true if port 465
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #222;">Hi ${name || "there"},</h2>
        <p style="font-size: 16px; color: #333;">
          ${message}
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" style="padding: 12px 24px; background-color: #000; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
            ${buttonText || "Verify Email"}
          </a>
        </div>
        <p style="color: #999;">If you didn’t request this, you can safely ignore this email.</p>
        <p style="font-size: 14px; color: #aaa;">– The CABNest Team</p>
      </div>
    `;

    const mailOptions = {
      from: `"CABNest" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw error;
  }
};

module.exports = sendEmail;
