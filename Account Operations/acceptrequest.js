async function acceptrequest(req, res, userDatabase) {
  let { usertoken, friendtoken } = req.body;

  let user = await userDatabase.findOne({ token: usertoken });
  let friend = await userDatabase.findOne({ token: friendtoken });

  if (user !== null && friend !== null) {
    await user.updateOne({ $pull: { followRequests: friendtoken } });
    await user.updateOne({ $push: { followers: friendtoken } });
    await friend.updateOne({ $push: { following: usertoken } });

    res.json({ status: true, response: "Accepted" });
  } else {
    res.json({
      status: false,
      repsonse: "User not found",
    });
  }
}

export default acceptrequest;
