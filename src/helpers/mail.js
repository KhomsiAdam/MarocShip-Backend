// Nodemailer
const nodemailer = require("nodemailer");

const mail = async (email, password) => {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  let info = await transporter.sendMail({
    from: `"MarocShip" <${testAccount.user}>`,
    to: email,
    subject: "Login credentials",
    text: "Login credentials",
    html: `<p><strong>email:</strong> ${email}</p><p><strong>password:</strong> ${password}</p>`
  });

  __log.debug("Message sent: %s", debug.messageId);
  __log.debug("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = mail;