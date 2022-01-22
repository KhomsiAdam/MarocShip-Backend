// Nodemailer
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

// Configure mailgen by setting a theme and your product info
const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'MarocShip',
    link: 'https://github.com/KhomsiAdam/MarocShip-Backend',
  },
});

const generatedEmail = () => {
  const content = {
    body: {
      intro: 'New deliveries are available for your type of vehicle.',
      action: {
        instructions: 'Please connect to your platform and claim a delivery.',
        button: {
          color: '#22BC66', // Optional action button color
          text: 'Connect',
          link: 'https://github.com/KhomsiAdam/MarocShip-Backend',
        },
      },
      outro: 'Please do not reply to this email. This was automatically sent.',
    },
  };
  return content;
};

const mail = async (email, type) => {
  const emailBody = mailGenerator.generate(generatedEmail(email));
  const emailText = mailGenerator.generatePlaintext(generatedEmail(email));

  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: `"MarocShip" <${testAccount.user}>`,
    to: email,
    subject: 'Deliveries Notification',
    text: emailText,
    html: emailBody,
  });

  // __log.debug(`Message sent: ${info.messageId}`);
  __log.debug(`Emails for delivery trucks of type "${type}" sent.`);
  __log.debug(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
};

module.exports = mail;
