function verifyusertoken(req, res, jwt, JWTSECRET) {
  let { token } = req.body;

  try {
    let verify = jwt.verify(token, JWTSECRET);
    res.json({
      status: true,
      userInfo: verify,
    });
  } catch (err) {
    res.json({
      status: false,
      response: "OTP Session timed out",
    });
  }
}

export default verifyusertoken;
