const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

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
  const transport = {
    service: "gmail",
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GPASS_KEY,
    },
  };
  const transporter = nodemailer.createTransport(transport);

  // Load template (otp or reset)
  let template = loadTemplate(options.type);

  // Replace placeholder with correct value
  if (options.type === "otp") {
    template = template.replace(/{{OTP}}/g, options.otp);
  } else if (options.type === "reset") {
    template = template.replace(/{{TOKEN}}/g, options.token);
  }
 console.log(process.env.GMAIL," ",process.env.GPASS_KEY)
  const message = {
    from: process.env.GMAIL,
    to: options.email,
    subject: options.subject,
    html: template,
  };

  await transporter.sendMail(message);
};

module.exports = sendEmail;
