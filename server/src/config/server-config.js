const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    geminiApiKey: process.env.GEMINI_API_KEY,
    mailUser: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    rechargeMail: process.env.RECHARGE_EMAIL,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUrl: process.env.GOOGLE_REDIRECT_URI,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    cors: process.env.CORS
}