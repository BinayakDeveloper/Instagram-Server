async function removedp(req, res, userDatabase) {
  let { token } = req.body;

  let user = await userDatabase.findOne({ token });

  if (user !== null) {
    let updateStatus = await user.updateOne({ $set: { profilePic: "" } });
    if (updateStatus.acknowledged) {
      res.json({
        status: true,
        response: "Removed successfully",
      });
    } else {
      res.json({
        status: false,
        response: "Remove failed",
      });
    }
  } else {
    res.json({
      status: false,
      response: "Invalid token",
    });
  }
}

export default removedp;
