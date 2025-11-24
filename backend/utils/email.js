const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// Dynamic template loader
function loadTemplate(type) {
  let filePath;

  if (type === "otp") {
    filePath = path.join(__dirname, "otp_template.html");
  } else {
    filePath = path.join(__dirname, "reset_pass.html");
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`Template not found: ${filePath}`);
  }

  return fs.readFileSync(filePath, "utf8");
}

const sendEmail = async (options) => {
  // const transport = {
  //   service: "gmail",
  //   auth: {
  //     user: process.env.GMAIL,
  //     pass: process.env.GPASS_KEY,
  //   },
  // };
  // const transport = {
  //   host: "smtp.gmail.com", // Explicitly define the host
  //   port: 587, // Use the common STARTTLS port
  //   secure: false, // Must be false for port 587
  //   auth: {
  //     user: process.env.GMAIL,
  //     pass: process.env.GPASS_KEY, // Use the App Password here!
  //   },
  //   // Optional: Add a timeout if the connection is slow (Render might need this)
  //   connectionTimeout: 30000,
  // };
  // const transporter = nodemailer.createTransport(transport);

  // Load template (otp or reset)
  let template = loadTemplate(options.type);

  // Replace placeholder with correct value
  if (options.type === "otp") {
    template = template.replace(/{{OTP}}/g, options.otp);
  } else if (options.type === "reset") {
    template = template.replace(/{{TOKEN}}/g, options.token);
  }

  const message = {
    from: process.env.GMAIL,
    to: options.email,
    subject: options.subject,
    html: template,
  };

  //await transporter.sendMail(message);

  try {
    //  Send the email using the SendGrid API
    await sgMail.send(message);
    console.log(`Email successfully sent to ${options.email} via SendGrid API.`);
  } catch (error) {
    // Check error details for non-connection issues (e.g., bad API key, unverified sender)
    console.error("SendGrid API Error:", error.response ? error.response.body : error);
    throw new Error("Failed to send email via SendGrid API.");
  }
};

module.exports = sendEmail;
