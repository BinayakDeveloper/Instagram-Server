import QRCode from "qrcode";

async function genuserqr(req, res, jwt, JWTSECRET, userDatabase) {
  let { usertoken } = req.body;

  try {
    let tokenVerify = await jwt.verify(usertoken, JWTSECRET);
    let user = await userDatabase.findOne({
      email: tokenVerify.email,
      number: tokenVerify.number,
    });

    if (user !== null) {
      let profileLink = `https://instame.vercel.app/dashboard/search/${user.username}`;

      let qrLink = await QRCode.toDataURL(profileLink);

      res.json({
        status: true,
        qrLink: qrLink,
        username: user.username,
      });
    } else {
      res.json({
        status: false,
        response: "User not found",
      });
    }
  } catch (error) {
    res.json({
      status: false,
      response: "Invalid token",
    });
  }
}

export default genuserqr;
