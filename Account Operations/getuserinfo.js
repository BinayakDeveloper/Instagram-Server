async function getuserinfo(req, res, jwt, JWTSECRET, userDatabase) {
  let { usertoken } = req.body;

  try {
    let userverify = jwt.verify(usertoken, JWTSECRET);
    let user = await userDatabase.findOne({
      email: userverify.email,
      number: userverify.number,
    });
    res.json({
      status: true,
      userInfo: user,
    });
  } catch (err) {
    res.json({
      status: false,
      response: "Invalid User",
    });
  }
}

export default getuserinfo;
