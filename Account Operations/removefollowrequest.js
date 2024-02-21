async function removefollowrequest(req, res, userDatabase) {
  let { usertoken, friendtoken } = req.body;

  let user = await userDatabase.findOne({ token: usertoken });
  let friend = await userDatabase.findOne({ token: friendtoken });

  if (user !== null && friend !== null) {
    await friend.updateOne({
      $pull: { followRequests: usertoken },
    });

    res.json({
      status: true,
      response: "Request removed",
    });
  }
}

export default removefollowrequest;
