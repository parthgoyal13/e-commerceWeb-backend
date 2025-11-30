const nodemailer = require("nodemailer");

// Create Brevo SMTP transporter
const createTransporter = () => {
  // Development mode: Log to console if no Brevo credentials
  if (!process.env.BREVO_SMTP_KEY || !process.env.BREVO_SMTP_USER) {
    return null;
  }

  return nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_KEY,
    },
  });
};

const sendPasswordResetEmail = async (email, resetToken) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

  // Development mode: Log to console if no Brevo credentials
  if (!process.env.BREVO_SMTP_KEY || !process.env.BREVO_SMTP_USER) {
    console.log("=".repeat(60));
    console.log("🔐 PASSWORD RESET EMAIL (Development Mode)");
    console.log("=".repeat(60));
    console.log(`To: ${email}`);
    console.log(`Reset Token: ${resetToken}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log("Note: Brevo credentials not configured. Set BREVO_SMTP_USER and BREVO_SMTP_KEY in .env");
    console.log("=".repeat(60));
    return { success: true, devMode: true };
  }

  // Production mode: Send real email via Brevo SMTP
  try {
    // Get and trim credentials
    const smtpUser = process.env.BREVO_SMTP_USER?.trim();
    const smtpKey = process.env.BREVO_SMTP_KEY?.trim();
    const smtpKeyLength = smtpKey?.length || 0;
    
    console.log(`Attempting to send email via Brevo SMTP`);
    console.log(`SMTP User: ${smtpUser}`);
    console.log(`SMTP Key length: ${smtpKeyLength} characters`);
    
    // Show first and last few characters of key for verification (safely)
    if (smtpKey && smtpKeyLength > 10) {
      const keyPreview = `${smtpKey.substring(0, 10)}...${smtpKey.substring(smtpKeyLength - 10)}`;
      console.log(`SMTP Key preview: ${keyPreview}`);
    }

    // Verify credentials format
    if (!smtpUser) {
      throw new Error("BREVO_SMTP_USER is required");
    }
    if (!smtpKey || smtpKeyLength < 80) {
      console.error(`ERROR: SMTP Key is only ${smtpKeyLength} characters. Expected ~100 characters.`);
      console.error("Make sure you copied the COMPLETE key from Brevo dashboard.");
      console.error("The key should start with 'xsmtpsib-' and be about 100 characters long.");
      throw new Error(`SMTP Key appears incomplete (${smtpKeyLength} chars). Please copy the full key from Brevo.`);
    }
    
    // Important: BREVO_SMTP_USER should be the "Login" value from Brevo dashboard, not necessarily an email
    console.log("NOTE: BREVO_SMTP_USER should match the 'Login' field in Brevo SMTP settings");
    
    // Create transporter with trimmed values
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpKey,
      },
    });

    const mailOptions = {
      from: process.env.BREVO_FROM_EMAIL || process.env.BREVO_SMTP_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #075985;">Password Reset Request</h2>
          <p>You requested to reset your password. Use the reset token below:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #666;">Your Reset Token:</p>
            <p style="margin: 10px 0 0 0; font-family: monospace; font-size: 16px; color: #075985; word-break: break-all; font-weight: bold;">${resetToken}</p>
          </div>
          <p style="color: #666;">Go to your app and enter this token on the reset password page.</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            This token will expire in 1 hour. If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully via Brevo:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending error:", error);
    
    // Provide helpful error messages
    if (error.code === 'EAUTH') {
      console.error("=".repeat(60));
      console.error("❌ BREVO SMTP AUTHENTICATION FAILED");
      console.error("=".repeat(60));
      console.error("Common issues and solutions:");
      console.error("");
      console.error("1. BREVO_SMTP_USER (Login):");
      console.error("   - Go to Brevo Dashboard → Settings → SMTP & API → SMTP");
      console.error("   - Copy the exact 'Login' value shown (NOT your account email)");
      console.error("   - It might be an email or a different format");
      console.error("");
      console.error("2. BREVO_SMTP_KEY:");
      console.error("   - Make sure you copied the COMPLETE SMTP key");
      console.error("   - Should be ~100 characters, starting with 'xsmtpsib-'");
      console.error("   - No spaces, no quotes, no line breaks");
      console.error("");
      console.error("3. Verify sender email:");
      console.error("   - The 'from' email must be verified in your Brevo account");
      console.error("   - Go to Brevo → Settings → Senders to verify");
      console.error("");
      console.error("4. Check .env file format:");
      console.error("   - No quotes around values");
      console.error("   - No spaces before/after =");
      console.error("   - Example: BREVO_SMTP_USER=your-login-value");
      console.error("=".repeat(60));
    }
    
    // Fall back to console logging if email fails
    console.log("=".repeat(60));
    console.log("🔐 PASSWORD RESET EMAIL (Fallback - Email Send Failed)");
    console.log("=".repeat(60));
    console.log(`To: ${email}`);
    console.log(`Reset Token: ${resetToken}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`Error: ${error.message}`);
    console.log("=".repeat(60));
    return { success: true, devMode: true, error: error.message };
  }
};

module.exports = { sendPasswordResetEmail };