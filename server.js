//!requireing modules
const { strict } = require("assert");
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
//! accessing modules
const app = express();
const port = 8080;
//middleware built in
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
//specifying engine
app.set("view engine", "ejs");
//!app.set("views", path.join(__dirname, "views"));
//mimic db
const userbd = [
  { name: "pavansai", password: "12345", role: "Admin" },
  { name: "dino", password: "67890", role: "User" },
];
// responding to a server request
//home
app.get("/", (req, res) => {
  res.render("home");
});
//login
app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const { username, password } = req.body;
    //console.log(username, password);
    const userfound = userbd.find((element) => {
      return element.name === username && element.password === password;
    });
    //!cookie for client
    res.cookie("UserCookie", JSON.stringify(userfound), {
      maxAge: 3 * 24 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    if (userfound) {
      //res.render("dashboard");
      res.redirect("/dashboard");
    } else {
      res.redirect("/login");
    }
  });
//dashboard
app.get("/dashboard", (req, res) => {
  //grab user name from cookie
  const parsecookieuser = req.cookies.UserCookie
    ? JSON.parse(req.cookies.UserCookie)
    : false;
  //console.log(parsecookieuser.name);
  const parseuserfound = userbd.find((element) => {
    return (
      element.name === parsecookieuser.name &&
      element.password === parsecookieuser.password
    );
  });
  //console.log(parseuserfound);
  if (parseuserfound) {
    //console.log("authorized");
    res.render("dashboard");
  } else {
    res.redirect("/login");
    //console.log("failed");
  }
});
//dashboard
app.get("/logout", (req, res) => {
  res.clearCookie("UserCookie");
  res.redirect("/login");
});
// listenting to port
app.listen(port, (error) => {
  try {
    console.log(`port is listening at: http://localhost:${port}`);
  } catch (error) {
    console.log("error message :", error);
  }
});
