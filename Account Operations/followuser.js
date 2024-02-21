async function followuser(req, res, userDatabase) {
  let { usertoken, friendtoken } = req.body;

  let user = await userDatabase.findOne({ token: usertoken });
  let friend = await userDatabase.findOne({ token: friendtoken });

  if (user !== null && friend !== null) {
    let privateUser = friend.privateStatus;

    if (!privateUser) {
      await user.updateOne({ $push: { following: friendtoken } });
      await friend.updateOne({ $push: { followers: usertoken } });
      res.json({
        status: true,
        response: "Followed successfully",
      });
    } else {
      if (!friend.followRequests.includes(usertoken)) {
        await friend.updateOne({ $push: { followRequests: usertoken } });
        res.json({
          status: true,
          response: "Request sent",
        });
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
