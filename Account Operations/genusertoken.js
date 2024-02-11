async function genusertoken(req, res, userDatabase, bcrypt, jwt, JWTSECRET) {
  let { number, email, name, username, password } = req.body;

  let userExistance = await userDatabase.findOne({
    $or: [{ number }, { username }, { email }],
  });

  if (userExistance !== null) {
    res.json({
      status: false,
      response: "User Already Exists",
    });
  } else {
    let encryptedPass = await bcrypt.hash(password, 10);

    let userDetails = {
      number,
      email,
      name,
      username,
      password: encryptedPass,
    };

    let userToken = jwt.sign(userDetails, JWTSECRET, { expiresIn: "20s" });

    res.json({
      status: true,
      userToken,
    });
  }
}

export default genusertoken;
