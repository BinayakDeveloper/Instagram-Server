import nodemailer from "nodemailer";
import env from "dotenv";

env.config({
  path: "./.env",
});

const { APP_PASSWORD } = process.env;

async function sendMail(to, subject, body) {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "banjarajajabar@gmail.com",
      pass: APP_PASSWORD,
    },
  });

  try {
    await transport.sendMail({
      from: "banjarajajabar@gmail.com",
      to,
      subject,
      html: body,
    });

    return true;
  } catch (err) {
    return false;
  }
}

export default sendMail;
