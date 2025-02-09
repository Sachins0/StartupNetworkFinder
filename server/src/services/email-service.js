const nodemailer = require('nodemailer');
const { ServerConfig } = require('../config');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: ServerConfig.mailUser,
        pass: ServerConfig.password
    }
});

const sendRechargeEmail = async (userEmail) => {
    const mailOptions = {
        from: ServerConfig.mailUser,
        to: userEmail,
        subject: 'Credits Exhausted - Recharge Instructions',
        text: `Your search credits have been exhausted. To recharge, please send an email to ${ServerConfig.rechargeMail} with the subject "recharge 5 credits". Please note you can recharge only one time`,
    };
    await transporter.sendMail(mailOptions);
};

const sendRechargeRejectionEmail = async (userEmail) => {
    const mailOptions = {
      from: ServerConfig.mailUser,
      to: userEmail,
      subject: 'Credit Recharge Request Rejected',
      text: 'Sorry, we are not offering additional credits at this time as you have already used your one-time recharge.'
    };
  
    await transporter.sendMail(mailOptions);
};

const sendRechargeConfirmationEmail = async (userEmail, newCredits) => {
    const mailOptions = {
      from: ServerConfig.mailUser,
      to: userEmail,
      subject: 'Credits Recharged Successfully',
      text: `Your account has been successfully recharged with 5 credits. Your new balance is ${newCredits} credits. Login to your account to start searching!`
    };
  
    await transporter.sendMail(mailOptions);
};

module.exports = {
    sendRechargeEmail,
    sendRechargeRejectionEmail,
    sendRechargeConfirmationEmail
}