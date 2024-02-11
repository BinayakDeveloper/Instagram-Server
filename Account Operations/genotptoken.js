import sendMail from "../Nodemailer/sendMail.js";

async function genotptoken(req, res, bcrypt, jwt, JWTSECRET) {
  let { userInfo } = req.body;

  let originalOtp = Math.floor(1000 + Math.random() * 8999).toString();

  let subject = "OTP For Verification";

  let body = `Hi ${
    userInfo.name.split(" ")[0]
  } Your Code For Verification Is ${originalOtp}`;

  let mailStatus = await sendMail(userInfo.email, subject, body);

  if (mailStatus) {
    const hashedOtp = await bcrypt.hash(originalOtp, 10);

    let otpToken = jwt.sign({ otp: hashedOtp, userInfo }, JWTSECRET, {
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
