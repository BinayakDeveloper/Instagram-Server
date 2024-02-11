import sendMail from "../Nodemailer/sendMail.js";

async function genforgottoken(req, res, userDatabase, jwt, JWTSECRET) {
  const { data } = req.body;

  let user = await userDatabase.findOne({
    $or: [{ email: data }, { number: data }, { username: data }],
  });

  if (user !== null) {
    let userPassword = user.password;
    let id = user.id;
    let TEMP_SECRET = JWTSECRET + userPassword.slice(userPassword.length - 5);

    let forgotToken = jwt.sign(
      {
        id,
      },
      TEMP_SECRET,
      { expiresIn: "5m" }
    );

    let receiverMail = user.email;

    let forgotPassSubject = "Link For Password Reset";

    let mailBody = `Hi ${
      user.name.split(" ")[0]
    } your password reset link is <a href="https://instaflix.vercel.app/changepass/${forgotToken}/${
      user.token
    }">Click Here</a>. It Is Valid For 5 Minutes`;

    let mailStatus = sendMail(receiverMail, forgotPassSubject, mailBody);

    if (mailStatus) {
      res.json({
        status: true,
        response: "Reset link sent to your mail",
      });
    } else {
      res.json({
        status: false,
        response: "Invalid Email",
      });
    }
  } else {
    res.json({
      status: false,
      response: "Invalid Email",
    });
  }
}

export default genforgottoken;
