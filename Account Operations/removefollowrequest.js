async function removefollowrequest(req, res, userDatabase) {
  let { usertoken, friendtoken } = req.body;

  let user = await userDatabase.findOne({ token: usertoken });
  let friend = await userDatabase.findOne({ token: friendtoken });

  if (user !== null && friend !== null) {
    let removeRequest = await friend.updateOne({
      $pull: { followRequests: usertoken },
    });

    if (removeRequest.acknowledged) {
      res.json({
        status: true,
        response: "Request removed",
      });
    } else {
      res.json({
        status: false,
        response: "Unknown error occured",
      });
    }
  }
}

export default removefollowrequest;
