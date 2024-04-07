async function followuser(req, res, userDatabase) {
  let { usertoken, friendtoken } = req.body;

  let user = await userDatabase.findOne({ token: usertoken });
  let friend = await userDatabase.findOne({ token: friendtoken });

  if (user !== null && friend !== null) {
    let privateUser = friend.privateStatus;

    if (!privateUser) {
      let userUpdate = await user.updateOne({
        $push: { following: friendtoken },
      });
      let friendUpdate = await friend.updateOne({
        $push: { followers: usertoken },
      });

      if (userUpdate.acknowledged && friendUpdate.acknowledged) {
        res.json({
          status: true,
          response: "Followed successfully",
        });

        let notificationUpdate = await friend.updateOne({
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
      } else {
        res.json({
          status: false,
          response: "Unknown error occured",
        });
      }
    } else {
      if (!friend.followRequests.includes(usertoken)) {
        let friendUpdate = await friend.updateOne({
          $push: { followRequests: usertoken },
        });
        if (friendUpdate.acknowledged) {
          res.json({
            status: true,
            response: "Request sent",
          });
        } else {
          res.json({
            status: false,
            response: "Unknown error occured",
          });
        }
      }
    }
  } else {
    res.json({
      status: false,
      response: "User not found",
    });
  }
}

export default followuser;
