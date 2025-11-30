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
  // URL encode the token to ensure it works in all email clients
  const encodedToken = encodeURIComponent(resetToken);
  const resetUrl = `${frontendUrl}/reset-password?token=${encodedToken}`;

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
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4;">
            <tr>
              <td align="center" style="padding: 20px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #075985; margin: 0 0 20px 0; font-size: 24px;">Password Reset Request</h2>
                      <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">You requested to reset your password. Click the link or button below to reset it:</p>
                      
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 25px 0;">
                        <tr>
                          <td align="center" style="padding: 0;">
                            <a href="${resetUrl}" target="_blank" style="color: #075985; font-size: 18px; font-weight: bold; text-decoration: underline; word-break: break-all;">${resetUrl}</a>
                          </td>
                        </tr>
                      </table>
                      
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                        <tr>
                          <td align="center" style="padding: 20px 0;">
                            <table border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border-spacing: 0;">
                              <tr>
                                <td align="center" bgcolor="#075985" style="border-radius: 6px;">
                                  <a href="${resetUrl}" target="_blank" style="display: block; padding: 14px 32px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 6px; background-color: #075985;">
                                    Reset Password
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                        <tr>
                          <td align="center" style="padding: 0;">
                            <p style="color: #666; font-size: 14px; margin: 0;">
                              If the button doesn't work, click this link: 
                              <a href="${resetUrl}" target="_blank" style="color: #075985; text-decoration: underline; word-break: break-all;">${resetUrl}</a>
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #666; font-size: 14px; margin: 30px 0 10px 0;">Or copy and paste this link in your browser:</p>
                      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5; border-radius: 4px; margin: 10px 0;">
                        <tr>
                          <td style="padding: 12px;">
                            <p style="word-break: break-all; color: #666; font-size: 12px; margin: 0; font-family: monospace;">
                              <a href="${resetUrl}" target="_blank" style="color: #075985; text-decoration: underline;">${resetUrl}</a>
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 20px;">
                        <tr>
                          <td>
                            <p style="color: #999; font-size: 12px; margin: 0; line-height: 1.5;">
                              This link will expire in 1 hour. If you didn't request this, please ignore this email.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
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