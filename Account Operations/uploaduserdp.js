import cloudinary from "../Cloudinary/config.js";

async function uploaddp(req, res, userDatabase) {
  let { file } = req;
  let { token } = req.body;

  try {
    if (file.mimetype.startsWith("image") === false || file.size > 5242880) {
      res.json({
        status: false,
        response: "Upload Images Under 5MB",
      });
    } else {
      let user = await userDatabase.findOne({ token });

      if (user !== null) {
        try {
          if (user.publicId === "" || user.profilePic === "") {
            let picUploadStatus = await cloudinary.uploader.upload(file.path, {
              folder: "Instagram Profile Pictures",
            });

            let securedUrl = picUploadStatus.secure_url;
            let publicId = picUploadStatus.public_id;

            let updateStatus = await user.updateOne({
              $set: { profilePic: securedUrl, publicId: publicId },
            });

            if (updateStatus.acknowledged) {
              res.json({
                status: true,
                response: "Upload successful",
              });
            } else {
              res.json({
                status: false,
                response: "Upload failed",
              });
            }
          } else {
            // Removing Old Pic
            let removeOldPic = await cloudinary.uploader.destroy(user.publicId);

            if (removeOldPic.result === "ok") {
              // Storing New Pic
              let picUploadStatus = await cloudinary.uploader.upload(
                file.path,
                {
                  folder: "Instagram Profile Pictures",
                }
              );

              let securedUrl = picUploadStatus.secure_url;
              let publicId = picUploadStatus.public_id;

              let updateStatus = await user.updateOne({
                $set: { profilePic: securedUrl, publicId: publicId },
              });

              if (updateStatus.acknowledged) {
                res.json({
                  status: true,
                  response: "Upload successful",
                });
              } else {
                res.json({
                  status: false,
                  response: "Upload failed",
                });
              }
            } else {
              res.json({
                status: false,
                response: "Upload failed",
              });
            }
          }
        } catch (e) {
          res.json({
            status: false,
            response: "Upload failed",
          });
        }
      }
    }
  } catch (e) {
    res.json({
      status: false,
      response: "Upload failed",
    });
  }
}

export default uploaddp;
