async function changepass(req, res, jwt, JWTSECRET, userDatabase, bcrypt) {
  let { forgottoken, newPass, oldPass } = req.body;

  try {
    let tokenVerify = jwt.verify(
      forgottoken,
      JWTSECRET + oldPass.slice(oldPass.length - 5)
    );

    let newEncryptedPass = await bcrypt.hash(newPass, 10);

    await userDatabase.findByIdAndUpdate(tokenVerify.id, {
      $set: { password: newEncryptedPass },
    });

    res.json({
      status: true,
      response: "Password has been changed",
    });
  } catch (error) {
    res.json({
      status: false,
      response: "Session Timed Out",
    });
  }
}

export default changepass;
