var express = require("express");
var router = express.Router();

const passport = require("passport");
const localStrategy = require("passport-local");
const userCollection = require("../models/user.schema");
const { middle } = require("../middleware/middle");
const { sendMail } = require("../utils/send");

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
  };
});

router.post('/verifyOTP/:id', async (req,res,next)=>{
  try{
    const userr = await userCollection.findById(req.params.id);
    if(!userr) 
      return res.send('user not found');
    
    if(userr.otp != req.body.otp) {
      userr.otp=0;
    await userr.save()
    await res.send('invalid otp <a href="/send-mail" </a>');

    };
    userr.otp=0;
    await userr.setPassword(req.body.password);
    await userr.save();
    res.redirect("/login");
   } catch(err){
      console.log(err);
      res.send(err)
    };
});

module.exports = router;
