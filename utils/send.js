const nodemailer = require("nodemailer");


exports.sendMail = async (req, res, user) => {
  const OTP = Math.floor(1000 + Math.random() * 9000);
  const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: "numanansari078@gmail.com",
        pass: "lrybqcnbqztcgihx",
      },
  });

  const mailOptions = {
      from: "NUMU. Pvt. Ltd. <support@numu.com>",
      to: req.body.email,
      subject: "Password reset link!",
      html: `
              <h6>Hello</h6>${user.username}  
              <p>Don't share OTP 🙏🙏</p>
              <br>
              <br>
              <h2>OTP: ${OTP}</h2>
          `,
  };

  transport.sendMail(mailOptions, async (err, info) => {
      if (err) return res.send(err);
      console.log(info);

      user.otp = OTP;
      await user.save();

      return res.redirect(`/verifyOTP/${user._id}`);
  });
};

