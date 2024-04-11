async function unfollowuser(req, res, userDatabase) {
  let { usertoken, friendtoken } = req.body;

  let user = await userDatabase.findOne({ token: usertoken });
  let friend = await userDatabase.findOne({ token: friendtoken });

  if (user !== null && friend !== null) {
    let userUpdate = await user.updateOne({
      $pull: { following: friendtoken },
    });
    let friendUpdate = await friend.updateOne({
      $pull: { followers: usertoken },
    });

    let notificationUpdate = await friend.updateOne({
      $pull: { notifications: { type: "follow", friendToken: usertoken } },
    });

    if (
      userUpdate.acknowledged &&
      friendUpdate.acknowledged &&
      notificationUpdate.acknowledged
    ) {
      res.json({
        status: true,
        response: "Unfollowed successfully",
      });
    } else {
      res.json({
        status: false,
        response: "Unknown error occured",
      });
    }
  } else {
    res.json({
      status: false,
      response: "User not found",
    });
  }
}

export default unfollowuser;
