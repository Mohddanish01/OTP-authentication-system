import path from "node:path";
import fs from "node:fs";
import handleBars from "handlebars";
import nodeMailer from "nodemailer";

export const verifyMail = async (email, token) => {
  const filePath = path.join(import.meta.dirname, "template.hbs");
  const emailTemplateSource = fs.readFileSync(filePath, "utf-8");

  const template = handleBars.compile(emailTemplateSource);
  const htmlToSend = template({ token: encodeURIComponent(token) });

  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailConfiguration = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Email Verification",
    html: htmlToSend,
  };

  transporter.sendMail(mailConfiguration, (err, info) => {
    if (err) console.log(err);
    console.log("Email sent successfully", info);
  });
};
