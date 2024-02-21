async function declinerequest(req, res, userDatabase) {
  let { usertoken, friendtoken } = req.body;

  let user = await userDatabase.findOne({ token: usertoken });
  let friend = await userDatabase.findOne({ token: friendtoken });

  if (user !== null && friend !== null) {
    let declineStatus = await user.updateOne({
      $pull: { followRequests: friendtoken },
    });
    if (declineStatus.acknowledged) {
      res.json({
        status: true,
        repsonse: "Declined",
      });
    } else {
      res.json({
        status: false,
        repsonse: "Unknown error occured",
      });
    }
  } else {
    res.json({
      status: false,
      repsonse: "User not found",
    });
  }
}

export default declinerequest;
