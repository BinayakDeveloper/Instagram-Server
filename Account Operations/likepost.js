async function likepost(req, res, jwt, JWTSECRET, userDatabase) {
  const { postToken, userToken } = req.body;

  try {
    let postVerify = await jwt.verify(postToken, JWTSECRET);
    let user = await userDatabase.findOne({ token: postVerify.userToken });
    let allPosts = user.posts;

    allPosts.forEach((post) => {
      if (post.postToken === postToken) {
        if (post.likes.includes(userToken) === false)
          post.likes.push(userToken);
      }
    });

    let likeUpdateStatus = await user.updateOne({
      $set: { posts: allPosts },
    });

    likeUpdateStatus.acknowledged
      ? res.json({
          status: true,
          response: "Liked successfully",
        })
      : res.json({
          status: false,
          response: "Like failed",
        });
  } catch (error) {
    res.json({
      status: false,
      response: "Post verification failed",
    });
  }
}

export default likepost;
