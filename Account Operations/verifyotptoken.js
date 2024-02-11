async function verifyotptoken(req, res, jwt, JWTSECRET, userDatabase) {
  let { enteredOtp, otpToken } = req.body;

  try {
    let otpValidate = await jwt.verify(otpToken, JWTSECRET);

    if (enteredOtp == otpValidate.otp) {
      res.json({
        status: true,
        response: "OTP Verified",
      });

      let newUserToken = await jwt.sign(
        {
          email: otpValidate.userInfo.email,
          number: otpValidate.userInfo.number,
        },
        JWTSECRET
      );

      await userDatabase.create({
        number: otpValidate.userInfo.number,
        email: otpValidate.userInfo.email,
        name: otpValidate.userInfo.name,
        username: otpValidate.userInfo.username,
        password: otpValidate.userInfo.password,
        token: newUserToken,
      });
    } else {
      res.json({
        status: false,
        response: "Invalid OTP",
      });
    }
  } catch (err) {
    res.json({
      status: false,
      response: "Invalid OTP",
    });
  }
}

export default verifyotptoken;
