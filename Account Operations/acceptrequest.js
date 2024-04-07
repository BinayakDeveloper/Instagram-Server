async function acceptrequest(req, res, userDatabase) {
  let { usertoken, friendtoken } = req.body;

  let user = await userDatabase.findOne({ token: usertoken });
  let friend = await userDatabase.findOne({ token: friendtoken });

  if (user !== null && friend !== null) {
    let userUpdate1 = await user.updateOne({
      $pull: { followRequests: friendtoken },
    });
    let userUpdate2 = await user.updateOne({
      $push: { followers: friendtoken },
    });
    let friendUpdate1 = await friend.updateOne({
      $push: { following: usertoken },
    });
    if (
      userUpdate1.acknowledged &&
      userUpdate2.acknowledged &&
      friendUpdate1.acknowledged
    ) {
      res.json({ status: true, response: "Accepted" });
      let notificationUpdate = await user.updateOne({
        $push: {
          notification: {
            type: "follow",
            friendToken: friend.token,
            createdAt: new Date.now(),
          },
        },
      });

      if (notificationUpdate.acknowledged) {
        res.json({
          status: true,
          response: "Notification updated",
        });
      } else {
        res.json({
          status: false,
          response: "Error while updating notification",
        });
      }
    }
  } else {
    res.json({
      status: false,
      repsonse: "User not found",
    });
  }
}

export default acceptrequest;
