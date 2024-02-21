async function getnotifications(req, res, userDatabase) {
  let { usertoken } = req.body;

  let user = await userDatabase.findOne({ token: usertoken });

  if (user !== null) {
    let followRequests = user.followRequests;
    let notifications = user.notifications;

    let finalNotifications = {
      followRequests,
      notifications,
    };

    res.json({
      status: true,
      response: finalNotifications,
    });
  } else {
    res.json({
      status: false,
      response: "Invalid token",
    });
  }
}

export default getnotifications;
