async function searchUser(req, res, jwt, JWTSECRET, userDatabase) {
  let { username, token } = req.body;

  try {
    let verify = await jwt.verify(token, JWTSECRET);

    let users = await userDatabase.find();

    let finalUsers = [];

    users.forEach((user) => {
      if (
        (user.username.toLowerCase().includes(username.toLowerCase()) ||
          user.name.toLowerCase().includes(username.toLowerCase())) &&
        user.email !== verify.email &&
        user.number !== verify.number
      ) {
        let userObj = {
          username: user.username,
          name: user.name,
          profilePic: user.profilePic,
          followers: user.followers.length,
        };
        finalUsers.push(userObj);
      }
    });

    if (finalUsers.length !== 0) {
      res.json({
        status: true,
        users: finalUsers,
      });
    } else {
      res.json({
        status: false,
        response: "No user found",
      });
    }
  } catch (error) {
    res.json({
      status: false,
      response: "Invalid token",
    });
  }
}

export default searchUser;
