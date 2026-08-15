import asyncHandler from "express-async-handler";
import sendEmail from "../utils/sendEmail.js";

// @desc    Send a contact form message to the store owner
// @route   POST /api/contact
// @access  Public
export const sendContactMessage = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  await sendEmail({
    to: process.env.EMAIL_USER,
    subject: `New Contact Form Message from ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #3a2f28;">New Message from GlowAura Contact Form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; background:#f7f2ea; padding:12px; border-radius:8px;">${message}</p>
      </div>
    `,
  });

  res.status(200).json({ success: true, message: "Your message has been sent." });
});