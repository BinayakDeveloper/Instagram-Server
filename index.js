import express, { json, urlencoded } from "express";
import cors from "cors";
import env from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";

// Cloudinary Config
import cloudinary from "./Cloudinary/config.js";

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
import followuser from "./Account Operations/followuser.js";
import removefollowrequest from "./Account Operations/removefollowrequest.js";
import unfollowuser from "./Account Operations/unfollowuser.js";
import declinerequest from "./Account Operations/declinerequest.js";
import acceptrequest from "./Account Operations/acceptrequest.js";
import getnotifications from "./Account Operations/getnotifications.js";
import getbulkuserdata from "./Account Operations/getbulkuserdata.js";
import uploadpost from "./Account Operations/uploadpost.js";
import likepost from "./Account Operations/likepost.js";
import dislikepost from "./Account Operations/dislikepost.js";
import getpostinfo from "./Account Operations/getpostinfo.js";

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

app.post("/uploadpost", upload.single("userpost"), async (req, res) => {
  uploadpost(req, res, userDatabase, jwt, JWTSECRET);
});

app.post("/getpostinfo", auth, async (req, res) => {
  getpostinfo(req, res, userDatabase);
});

app.post("/likepost", auth, async (req, res) => {
  likepost(req, res, jwt, JWTSECRET, userDatabase);
});

app.post("/dislikepost", auth, async (req, res) => {
  dislikepost(req, res, jwt, JWTSECRET, userDatabase);
});

// Follow / Unfollow Api's

app.post("/followuser", auth, (req, res) => {
  followuser(req, res, userDatabase);
});

app.post("/removefollowrequest", auth, (req, res) => {
  removefollowrequest(req, res, userDatabase);
});

app.post("/unfollowuser", auth, (req, res) => {
  unfollowuser(req, res, userDatabase);
});

app.post("/declinerequest", auth, (req, res) => {
  declinerequest(req, res, userDatabase);
});

app.post("/acceptrequest", auth, (req, res) => {
  acceptrequest(req, res, userDatabase);
});

app.post("/getnotifications", auth, (req, res) => {
  getnotifications(req, res, userDatabase);
});

app.post("/getbulkuserdata", auth, (req, res) => {
  getbulkuserdata(req, res, userDatabase);
});

app.listen(500);
