const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter object using the default SMTP transport
  // We will use Gmail as our service
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address from .env
      pass: process.env.EMAIL_PASS, // Your Gmail App Password from .env
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: `LiveRestaurantMenu <${process.env.EMAIL_USER}>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    html: options.html, // html body
  };

  // 3. Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};

module.exports = sendEmail;
