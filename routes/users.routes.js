var express = require("express");
var router = express.Router();

const passport = require("passport");
const localStrategy = require("passport-local");
const userCollection = require("../models/user.schema");
const { middle } = require("../middleware/middle");
const { sendMail } = require("../utils/send");
const imagekit = require("../utils/imagekit");

passport.use(new localStrategy(userCollection.authenticate()));

router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    // await userCollection.register({username,email},password);
    const change = { username, email }; //non changeable data
    const fix = password; //encrypt data
    await userCollection.register(change, fix);
    res.redirect("/login");
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/users/profile",
    failureRedirect: "/login",
  }),
  (req, res, next) => {}
);

router.get("/profile", middle, (req, res, next) => {
  res.render("profile", { title: "SocialMedia | profile", user: req.user });
});

router.get("/logout", middle, (req, res, next) => {
  req.logout(() => {
    res.redirect("/login");
  });
});

router.post("/send-mail", async (req, res, next) => {
  try {
    const user = await userCollection.findOne({ email: req.body.email });
    console.log(req.body.email);
    console.log(user);
    if (!user)
      return res.send(
        "No user found with this email. <a href='/forget-email'>Try Again</a>"
      );
    await sendMail(req, res, user);
  } catch (err) {
    res.send(err.message);
  }
});

router.post("/verifyOTP/:id", async (req, res, next) => {
  try {
    const userr = await userCollection.findById(req.params.id);
    if (!userr) return res.send("user not found");

    if (userr.otp != req.body.otp) {
      userr.otp = 0;
      await userr.save();
      await res.send('invalid otp <a href="/send-mail" </a>');
    }
    userr.otp = 0;
    await userr.setPassword(req.body.password);
    await userr.save();
    res.redirect("/login");
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

router.get("/profile-setting", middle, (req, res, next) => {
  res.render("profile-setting", {
    title: "Setting | SocialMedia ",
    user: req.user,
  });
});

router.post("/avatar/:id", middle, async (req, res, next) => {
  const user = await userCollection.findById(req.params.id);
  console.log(req.body);
  try {
    const { url, fileId, thumbnailUrl } = await imagekit.upload({
      file: req.files.avatar.data,
      fileName: user.username,
      folder: "/avatar",
    });
    // Delete the old avatar if it exists

    if (req.user.avatar && req.user.avatar.fileId) {
      await imagekit.deleteFile(req.user.avatar.fileId);
    }

    // Update the user's new avatar info
    user.avatar = { fileId, url, thumbnailUrl };
    await user.save();

    res.redirect("/users/profile-setting");
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});
router.post("/update/:id", middle, async (req, res, next) => {
  try {
    const ID = req.params.id;
    await userCollection.findByIdAndUpdate(ID, req.body);
    res.redirect("/users/profile-setting");
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});

router.get("/delete/:id", middle, async (req, res, next) => {
  try {
    const user = await userCollection.findByIdAndDelete(req.params.id);
    await imagekit.deleteFile(user.avatar.fileId);
    res.redirect("/login");
  } catch (err) {
    res.send(err.message);
    console.log(err);
  }
});

router.get("/rest-password/:id", middle, async (req, res, next) => {
  res.render("restPassword", {
    title: "rest-password | socialMedia",
    user: req.user,
  });
});

router.post("/rest-password/:id", middle, async (req, res, next) => {
  try {
    await req.user.changePassword(req.body.oldPassword, req.body.newPassword);
    await req.user.save();
    res.redirect("/users/profile-setting");
  } catch (err) {
    res.send(err.message);
    console.log(err);
  }
});

router.get("/messenger", middle, async (req, res, next) => {
  const users = await userCollection.find({
    _id: { $ne: req.user._id },
  });
  res.render("Message", {
    title: "chat || Social-media",
    user: req.user,
    users,
  });
});

module.exports = router;
