async function verifylogin(req, res, bcrypt, userDatabase) {
  const { username, password } = req.body;

  let user = await userDatabase.findOne({
    $or: [{ number: username }, { username }, { email: username }],
  });

  if (user !== null) {
    let passComp = await bcrypt.compare(password, user.password);

    if (passComp) {
      res.json({
        status: true,
        token: user.token,
      });
    } else {
      res.json({
        status: false,
        response: "Invalid credentials",
      });
    }
  } else {
    res.json({
      status: false,
      response: "Invalid credentials",
    });
  }
}

export default verifylogin;
