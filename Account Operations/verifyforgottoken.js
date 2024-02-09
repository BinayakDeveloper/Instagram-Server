function verifyforgottoken(req, res, jwt, JWTSECRET) {
  const { token, oldPass } = req.body;
  try {
    let verify = jwt.verify(
      token,
      JWTSECRET + oldPass.slice(oldPass.length - 5)
    );
    res.json({
      status: true,
      respose: "Valid Page",
    });
  } catch (error) {
    res.json({
      status: false,
      respose: "Invalid Page",
    });
  }
}
export default verifyforgottoken;
