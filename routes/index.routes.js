var express = require("express");
var router = express.Router();
const postCollection = require("../models/posts.schema");

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    const posts = await postCollection.find();
    res.render("index", {
      title: "Homepage | socialMedia",
      user: req.user,
      posts: posts,
    });
  } catch (err) {
    res.send(err.message);
    console.log(err);
  }
});

router.get("/about", function (req, res, next) {
  res.render("about", { title: "About-page | socialMedia", user: req.user });
});
router.get("/contact", function (req, res, next) {
  res.render("contact", {
    title: "Contact-page | socialMedia",
    user: req.user,
  });
});
router.get("/login", function (req, res, next) {
  res.render("login", { title: "login-page | socialMedia", user: req.user });
});
router.get("/register", function (req, res, next) {
  res.render("register", {
    title: "register-page | socialMedia",
    user: req.user,
  });
});
router.get("/forgot-email", function (req, res, next) {
  res.render("forgot", {
    title: "forgot-page | socialMedia",
    user: req.user,
  });
});

router.get("/verifyOTP/:id", async (req, res, next) => {
  res.render("verifyFile", {
    title: "verify-Otp | social media",
    user: req.user,
    id: req.params.id,
  });
});

module.exports = router;
