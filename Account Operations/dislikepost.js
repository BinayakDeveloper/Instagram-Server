async function dislikePost(req, res, jwt, JWTSECRET, userDatabase) {
  const { postToken, userToken } = req.body;

  try {
    let postVerify = await jwt.verify(postToken, JWTSECRET);
    let user = await userDatabase.findById(postVerify.userId);
    let allPosts = user.posts;

    allPosts.forEach((post) => {
      if (post.postToken === postToken) {
        if (post.likes.includes(userToken) === true) post.likes.pop(userToken);
      }
    });

    let likeUpdateStatus = await user.updateOne({
      $set: { posts: allPosts },
    });

    likeUpdateStatus.acknowledged
      ? res.json({
          status: true,
          response: "Disliked successfully",
        })
      : res.json({
          status: false,
          response: "Dislike failed",
        });
  } catch (error) {
    res.json({
      status: false,
      response: "Post verification failed",
    });
  }
}

export default dislikePost;
