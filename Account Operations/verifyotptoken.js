async function verifyotptoken(req, res, jwt, bcrypt, JWTSECRET, userDatabase) {
  let { enteredOtp, otpToken } = req.body;

  try {
    let otpValidate = await jwt.verify(otpToken, JWTSECRET);
    let otpverify = await bcrypt.compare(enteredOtp, otpValidate.otp);

    if (otpverify) {
      res.json({
        status: true,
        response: "OTP Verified",
      });

      let userExistance = await userDatabase.findOne({
        email: otpValidate.userInfo.email,
        number: otpValidate.userInfo.number,
      });

      if (userExistance === null) {
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
          response: "Already Registered",
        });
      }
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
