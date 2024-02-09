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
  path: "./secret.env",
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

// app.use(auth);

// Login API
app.post("/login", async (req, res) => {
  verifylogin(req, res, bcrypt, userDatabase);
});

// Register API
app.post("/genusertoken", (req, res) => {
  genusertoken(req, res, userDatabase, bcrypt, jwt, JWTSECRET);
});

app.post("/verifyusertoken", (req, res) => {
  verifyusertoken(req, res, jwt, JWTSECRET);
});

app.post("/genotptoken", (req, res) => {
  genotptoken(req, res, APP_PASSWORD, bcrypt, jwt, JWTSECRET);
});

app.post("/verifyotptoken", (req, res) => {
  verifyotptoken(req, res, jwt, bcrypt, JWTSECRET, userDatabase);
});

// Forgot / Change Password API
app.post("/genforgottoken", (req, res) => {
  genforgottoken(req, res, userDatabase, jwt, JWTSECRET);
});

app.post("/verifyforgottoken", async (req, res) => {
  verifyforgottoken(req, res, jwt, JWTSECRET);
});

app.post("/changepass", async (req, res) => {
  changepass(req, res, jwt, JWTSECRET, userDatabase, bcrypt);
});

// Main Account API's

app.post("/getuserinfo", (req, res) => {
  getuserinfo(req, res, jwt, JWTSECRET, userDatabase);
});

app.post("/uploaddp", upload.single("userimage"), (req, res) => {
  uploaddp(req, res, userDatabase);
});

app.post("/removedp", (req, res) => {
  removedp(req, res, userDatabase);
});

app.post("/updateuserinfo", (req, res) => {
  updateuserinfo(req, res, userDatabase, jwt, JWTSECRET);
});

app.post("/searchuser", async (req, res) => {
  let { username, token } = req.body;

  try {
    let verify = await jwt.verify(token, JWTSECRET);

    let users = await userDatabase.find();

    let finalUsers = [];

    users.forEach((user) => {
      if (
        user.username.includes(username) &&
        user.email !== verify.email &&
        user.number !== verify.number
      ) {
        let userObj = {
          username: user.username,
          name: user.name,
          profilePic: user.profilePic,
          followers: user.followers.length,
        };
        finalUsers.push(userObj);
      }
    });

    if (finalUsers.length !== 0) {
      res.json({
        status: true,
        users: finalUsers,
      });
    } else {
      res.json({
        status: false,
        response: "No user found",
      });
    }
  } catch (error) {}
});
app.listen(500);
