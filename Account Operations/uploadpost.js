import cloudinary from "../Cloudinary/config.js";

async function uploadpost(req, res, userDatabase, jwt, JWTSECRET) {
  const { file } = req;
  const { caption, location, userId } = req.body;

  try {
    let user = await userDatabase.findById(userId);
    let postUpload = await cloudinary.uploader.upload(file.path, {
      folder: "Instagram Posts",
    });

    let { public_id, created_at, secure_url } = postUpload;

    let finalData = {
      postUrl: secure_url,
      postPublicId: public_id,
      createdAt: created_at,
      caption,
      location,
      userId,
      likes: [],
    };

    let postToken = await jwt.sign(finalData, JWTSECRET);
    finalData.postToken = postToken;

    let dataUpdate = await user.updateOne({ $push: { posts: finalData } });

    if (dataUpdate.acknowledged) {
      res.json({
        status: true,
        response: "Posted successfully",
      });
    } else {
      res.json({
        status: false,
        response: "Unknown error occured",
      });
    }
  } catch (err) {
    res.json({
      status: false,
      response: "User not found",
    });
  }
}

export default uploadpost;
