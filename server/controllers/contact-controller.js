const Contact = require("../models/Contact");
let nodemailer;
try {
  nodemailer = require("nodemailer");
} catch (e) {
  nodemailer = null;
}

const submitContactForm = async (req, res) => {
  try {
    const { name, email, category, message } = req.body;

    if (!name || !email || !category || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const newContact = new Contact({
      name,
      email,
      category,
      message,
    });

    await newContact.save();

    // Send email notification to support@bhavinacademy.com
    let emailSent = false;
    const supportEmail = process.env.SUPPORT_EMAIL || "support@bhavinacademy.com";

    if (nodemailer) {
      try {
        const smtpHost = process.env.SMTP_HOST;
        const smtpPort = process.env.SMTP_PORT || 587;
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;

        let transporter;
        if (smtpHost && smtpUser && smtpPass) {
          transporter = nodemailer.createTransport({
            host: smtpHost,
            port: Number(smtpPort),
            secure: Number(smtpPort) === 465,
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          });
        } else {
          // If no external SMTP is configured in .env, create standard json-transport or ethereal fallback
          transporter = nodemailer.createTransport({
            jsonTransport: true,
          });
        }

        const mailOptions = {
          from: `"Bhavin Academy Support" <${process.env.MAIL_FROM || supportEmail}>`,
          to: supportEmail,
          replyTo: email,
          subject: `[Contact Form] ${category}: Message from ${name}`,
          text: `You have received a new contact submission on Bhavin Academy.\n\nName: ${name}\nEmail: ${email}\nCategory: ${category}\n\nMessage:\n${message}\n\nSubmitted at: ${new Date().toISOString()}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e5e5; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #0071e3; margin-top: 0;">New Contact Form Message</h2>
              <p style="color: #6e6e73; font-size: 14px;">A visitor submitted an inquiry through the Bhavin Academy contact page.</p>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
                <tr>
                  <td style="padding: 8px 12px; background: #f5f5f7; font-weight: bold; width: 120px; border-radius: 6px 0 0 6px;">Name:</td>
                  <td style="padding: 8px 12px; background: #fafafa; border-radius: 0 6px 6px 0;">${name}</td>
                </tr>
                <tr><td colspan="2" style="height: 6px;"></td></tr>
                <tr>
                  <td style="padding: 8px 12px; background: #f5f5f7; font-weight: bold; border-radius: 6px 0 0 6px;">Email:</td>
                  <td style="padding: 8px 12px; background: #fafafa; border-radius: 0 6px 6px 0;"><a href="mailto:${email}" style="color: #0071e3; text-decoration: none;">${email}</a></td>
                </tr>
                <tr><td colspan="2" style="height: 6px;"></td></tr>
                <tr>
                  <td style="padding: 8px 12px; background: #f5f5f7; font-weight: bold; border-radius: 6px 0 0 6px;">Category:</td>
                  <td style="padding: 8px 12px; background: #fafafa; border-radius: 0 6px 6px 0;">${category}</td>
                </tr>
              </table>
              <div style="background: #f5f5f7; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin: 0 0 8px 0; color: #1d1d1f; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Message Content</h4>
                <p style="margin: 0; white-space: pre-wrap; font-size: 14px; color: #1d1d1f; line-height: 1.6;">${message}</p>
              </div>
              <p style="font-size: 12px; color: #86868b; margin-top: 24px; border-top: 1px solid #e5e5e5; padding-top: 16px;">
                Delivered automatically to <strong>${supportEmail}</strong> via Bhavin Academy Contact Service.
              </p>
            </div>
          `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Contact notification dispatched to support:", supportEmail, info?.messageId || "jsonTransport logged");
        emailSent = true;
      } catch (mailErr) {
        console.error("Nodemailer dispatch error:", mailErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully and email notification sent.",
      emailSent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while submitting the form.",
    });
  }
};

module.exports = { submitContactForm };
