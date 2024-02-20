import express, { urlencoded } from "express";
import cors from "cors";
import env from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";

// Userdefined Modules
import userDatabase from "./Database/user.js";
import genusertoken from "./Account Operations/genusertoken.js";
import genotptoken from "./Account Operations/genotptoken.js";
import genforgottoken from "./Account Operations/genforgottoken.js";
import verifyusertoken from "./Account Operations/verifyusertoken.js";
import verifyotptoken from "./Account Operations/verifyotptoken.js";
import verifyforgottoken from "./Account Operations/verifyforgottoken.js";
import verifylogin from "./Account Operations/verifylogin.js";
import getuserinfo from "./Account Operations/getuserinfo.js";
import changepass from "./Account Operations/changepass.js";
import uploaddp from "./Account Operations/uploaduserdp.js";
import removedp from "./Account Operations/removedp.js";
import updateuserinfo from "./Account Operations/updateuserinfo.js";
import searchUser from "./Account Operations/searchuser.js";
import getsearchuserinfo from "./Account Operations/getsearchuserinfo.js";
import genuserqr from "./Account Operations/genuserqr.js";

const app = express();

// Multer Config
const upload = multer({
  storage: multer.diskStorage({
    filename: (req, file, cb) => {
      cb(null, Date.now().toString());
    },
  }),
});

// ENV
env.config({
  path: "./.env",
});

const { AUTHPASS, JWTSECRET, APP_PASSWORD } = process.env;

// Userdefined Middleware
function auth(req, res, next) {
  let { authkey } = req.body;

  if (authkey === AUTHPASS) {
    next();
  } else {
    if (authkey === "") {
      res.json({
        status: false,
        response: "Enter The AUTH KEY",
      });
    } else {
      res.json({
        status: false,
        response: "Invalid Key",
      });
    }
  }
}

// Middlewares Use
app.use(express.json());
app.use(urlencoded({ extended: false }));

app.use(
  cors({
    methods: ["GET", "POST"],
    origin: "*",
  })
);

// Login API
app.post("/login", auth, async (req, res) => {
  verifylogin(req, res, bcrypt, userDatabase);
});

// Register API
app.post("/genusertoken", auth, (req, res) => {
  genusertoken(req, res, userDatabase, bcrypt, jwt, JWTSECRET);
});

app.post("/verifyusertoken", auth, (req, res) => {
  verifyusertoken(req, res, jwt, JWTSECRET);
});

app.post("/genotptoken", auth, (req, res) => {
  genotptoken(req, res, bcrypt, jwt, JWTSECRET);
});

app.post("/verifyotptoken", auth, (req, res) => {
  verifyotptoken(req, res, jwt, bcrypt, JWTSECRET, userDatabase);
});

// Forgot / Change Password API
app.post("/genforgottoken", auth, (req, res) => {
  genforgottoken(req, res, userDatabase, jwt, JWTSECRET);
});

app.post("/verifyforgottoken", auth, async (req, res) => {
  verifyforgottoken(req, res, jwt, JWTSECRET);
});

app.post("/changepass", auth, async (req, res) => {
  changepass(req, res, jwt, JWTSECRET, userDatabase, bcrypt);
});

// Main Account API's

app.post("/getuserinfo", auth, (req, res) => {
  getuserinfo(req, res, jwt, JWTSECRET, userDatabase);
});

app.post("/uploaddp", upload.single("userimage"), (req, res) => {
  uploaddp(req, res, userDatabase);
});

app.post("/removedp", auth, (req, res) => {
  removedp(req, res, userDatabase);
});

app.post("/updateuserinfo", auth, (req, res) => {
  updateuserinfo(req, res, userDatabase, jwt, JWTSECRET);
});

app.post("/searchuser", auth, (req, res) => {
  searchUser(req, res, jwt, JWTSECRET, userDatabase);
});

app.post("/getsearchuserinfo", auth, (req, res) => {
  getsearchuserinfo(req, res, jwt, JWTSECRET, userDatabase);
});

app.post("/generateuserqr", auth, (req, res) => {
  genuserqr(req, res, jwt, JWTSECRET, userDatabase);
});

// Follow / Unfollow Api's

app.post("/followuser", auth, async (req, res) => {
  let { usertoken, friendtoken } = req.body;

  let user = await userDatabase.findOne({ token: usertoken });
  let friend = await userDatabase.findOne({ token: friendtoken });
  if (user !== null && friend !== null) {
    let privateUser = friend.privateStatus;
    if (!privateUser) {
      await user.updateOne({ $push: { following: friendtoken } });
      await friend.updateOne({ $push: { followers: usertoken } });
      res.json({
        status: true,
        response: "Followed successfully",
      });
    } else {
      await friend.updateOne({ $push: { followRequests: usertoken } });
      res.json({
        status: true,
        response: "Request sent",
      });
    }
  } else {
    res.json({
      status: false,
      response: "User not found",
    });
  }
});

app.post("/removefollowrequest", auth, async (req, res) => {
  let { usertoken, friendtoken } = req.body;

  let user = await userDatabase.findOne({ token: usertoken });
  let friend = await userDatabase.findOne({ token: friendtoken });

  if (user !== null && friend !== null) {
    await friend.updateOne({ $pull: { followRequests: usertoken } });
    res.json({
      status: true,
      response: "Request removed",
    });
  }
});

app.post("/unfollowuser", auth, async (req, res) => {
  let { usertoken, friendtoken } = req.body;

  let user = await userDatabase.findOne({ token: usertoken });
  let friend = await userDatabase.findOne({ token: friendtoken });

  if (user !== null && friend !== null) {
    await user.updateOne({ $pull: { following: friendtoken } });
    await friend.updateOne({ $pull: { followers: usertoken } });
    res.json({
      status: true,
      response: "Unfollowed successfully",
    });
  } else {
    res.json({
      status: false,
      response: "User not found",
    });
  }
});

app.listen(500);
