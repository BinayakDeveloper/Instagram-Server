async function getsearchuserinfo(req, res, jwt, JWTSECRET, userDatabase) {
  let { usertoken, username } = req.body;

  try {
    let tokenVerify = jwt.verify(usertoken, JWTSECRET);
    let user = await userDatabase.findOne({
      email: tokenVerify.email,
      number: tokenVerify.number,
    });

    if (user !== null) {
      let searchedUser = await userDatabase.findOne({ username });
      if (searchedUser !== null) {
        if (
          user.username !== searchedUser.username &&
          user.email !== searchedUser.email
        ) {
          res.json({
            status: true,
            searchedUserInfo: searchedUser,
          });
        } else {
          res.json({
            status: false,
            response: "Invalid username",
          });
        }
      } else {
        res.json({
          status: false,
          response: "Invalid username",
        });
      }
    } else {
      res.json({
        status: false,
        response: "Invalid token",
      });
    }
  } catch (error) {
    res.json({
      status: false,
      response: "Invalid token",
    });
  }
}

export default getsearchuserinfo;
