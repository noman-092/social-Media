var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Homepage | socialMedia' });
});
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About-page | socialMedia' });
});
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact-page | socialMedia' });
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'login-page | socialMedia' });
});
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'register-page | socialMedia' });
});
router.get('/forgot-email', function(req, res, next) {
  res.render('forgot', {
     title: 'forgot-page | socialMedia',
     user:req.user
    });
});

router.get('/verifyOTP/:id', async (req,res,next)=>{
  res.render('verifyFile', {
    title:"verify-Otp | social media",
     user:req.user,
      id: req.params.id 
    });
});

module.exports = router;
