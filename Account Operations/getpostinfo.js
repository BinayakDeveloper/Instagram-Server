async function getpostinfo(req, res, userDatabase) {
  const { userToken, postToken, postUserToken } = req.body;

  try {
    const postUser = await userDatabase.findOne({ token: postUserToken });
    if (postUser !== null) {
      let privateStatus = postUser.privateStatus;
      if (privateStatus) {
        let followingStatus = postUser.followers.includes(userToken);
        if (followingStatus === true) {
          const post = postUser.posts.find((curPost) => {
            if (curPost.postToken === postToken) return curPost;
            return undefined;
          });

          if (post !== undefined) {
            res.json({
              status: true,
              postInfo: post,
              username: postUser.username,
              profilePic: postUser.profilePic,
            });
          } else {
            res.json({
              status: false,
              issue: "invalid post link",
              response: "Invalid Post",
              username: postUser.username,
            });
          }
        } else {
          res.json({
            status: false,
            issue: "follow",
            response: `Follow @${postUser.username} to see the post`,
            username: postUser.username,
          });
        }
      } else {
        const post = postUser.posts.find((curPost) => {
          if (curPost.postToken === postToken) return curPost;
          return undefined;
        });

        if (post !== undefined) {
          res.json({
            status: true,
            postInfo: post,
            username: postUser.username,
            profilePic: postUser.profilePic,
          });
        } else {
          res.json({
            status: false,
            issue: "invalid post link",
            response: "Invalid Post",
            username: postUser.username,
          });
        }
      }
    } else {
      res.json({
        status: false,
        issue: "invalid post link",
        response: "Invalid Post",
        username: postUser.username,
      });
    }
  } catch (e) {
    res.json({
      status: false,
      issue: "unknown issue",
      response: "Unknown error occured",
    });
  }
}

export default getpostinfo;
