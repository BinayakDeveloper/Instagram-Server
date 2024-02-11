import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://WebDeveloper:webdev@maincluster.cq4nipw.mongodb.net/?retryWrites=true&w=majority",
    {
      dbName: "Instagram",
    }
  )
  .then(() => {
    console.log("Database Connected Successfully");
  });

let userSchema = new mongoose.Schema({
  number: {
    type: String,
  },
  email: {
    type: String,
  },
  name: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  profilePic: {
    type: String,
    default: "",
  },
  publicId: {
    type: String,
    default: "",
  },
  posts: {
    type: Array,
  },
  followers: {
    type: Array,
  },
  following: {
    type: Array,
  },
  bio: {
    type: String,
    default: "",
  },
  privateStatus: {
    type: Number,
    default: 0,
  },
  token: {
    type: String,
  },
});

let userModel = mongoose.model("userModel", userSchema, "userinfo");

export default userModel;
