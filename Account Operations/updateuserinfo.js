async function updateuserinfo(req, res, userDatabase, jwt, JWTSECRET) {
  const { usertoken, name, username, bio, privateStatus } = req.body;

  try {
    let userId = await jwt.verify(usertoken, JWTSECRET);

    let update = await userDatabase.updateOne(
      { number: userId.number, email: userId.email },
      {
        $set: {
          name,
          username,
          bio,
          privateStatus,
        },
      }
    );

    if (update.acknowledged) {
      res.json({
        status: true,
        response: "Updated successfully",
      });
    } else {
      res.json({
        status: false,
        response: "Updation Failed",
      });
    }
  } catch (error) {
    res.json({
      status: false,
      response: "Invalid Token",
    });
  }
}

export default updateuserinfo;
