import cloudinary from "../Cloudinary/config.js";

async function removedp(req, res, userDatabase) {
  let { token } = req.body;

  let user = await userDatabase.findOne({ token });

  if (user !== null) {
    let serverRemoveStatus = await cloudinary.uploader.destroy(user.publicId);
    let updateStatus = await user.updateOne({ $set: { profilePic: "" } });
    let updateStatus2 = await user.updateOne({ $set: { publicId: "" } });
    if (
      updateStatus.acknowledged &&
      updateStatus2.acknowledged &&
      serverRemoveStatus.result === "ok"
    ) {
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
