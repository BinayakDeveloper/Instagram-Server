async function unfollowuser(req, res, userDatabase) {
  let { usertoken, friendtoken } = req.body;

  let user = await userDatabase.findOne({ token: usertoken });
  let friend = await userDatabase.findOne({ token: friendtoken });

  if (user !== null && friend !== null) {
    await user.updateOne({ $pull: { following: friendtoken } });
    await friend.updateOne({ $pull: { followers: usertoken } });
    res.json({
      status: true,
      response: "Unfollowed successfully",
    });
  } else {
    res.json({
      status: false,
      response: "User not found",
    });
  }
}

export default unfollowuser;
