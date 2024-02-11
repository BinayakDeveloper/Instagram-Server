import sendMail from "../Nodemailer/sendMail.js";

async function genotptoken(req, res, APP_PASSWORD, bcrypt, jwt, JWTSECRET) {
  let { userInfo } = req.body;

  let originalOtp = Math.floor(1000 + Math.random() * 8999).toString();

  let subject = "OTP For Verification";

  let body = `Hi ${
    userInfo.name.split(" ")[0]
  } Your Code For Verification Is ${originalOtp}`;

  let mailStatus = sendMail(userInfo.email, subject, body);

  if (mailStatus) {
    let otpToken = jwt.sign({ otp: originalOtp, userInfo }, JWTSECRET, {
      expiresIn: "5m",
    });

    res.json({
      status: true,
      response: "OTP Sent Successfully",
      otpToken,
    });
  }
}

export default genotptoken;
