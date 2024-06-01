async function followuser(req, res, userDatabase) {
  let { usertoken, friendtoken } = req.body;

  let user = await userDatabase.findOne({ token: usertoken });
  let friend = await userDatabase.findOne({ token: friendtoken });

  if (user !== null && friend !== null) {
    let privateUser = friend.privateStatus;

    // Add Notifications In Public Accounts

    if (!privateUser) {
      let userUpdate = await user.updateOne({
        $push: { following: friendtoken },
      });
      let friendUpdate = await friend.updateOne({
        $push: { followers: usertoken },
      });

      let friendNotificationUpdate = await friend.updateOne({
        $push: {
          notifications: {
            type: "follow",
            friendToken: user.token,
            createdAt: Date.now(),
          },
        },
      });

      if (
        userUpdate.acknowledged &&
        friendUpdate.acknowledged &&
        friendNotificationUpdate.acknowledged
      ) {
        res.json({
          status: true,
          response: "Followed Successfully & Notification updated",
        });
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
