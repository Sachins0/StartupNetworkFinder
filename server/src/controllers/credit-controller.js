const {google} = require('googleapis');
const { ServerConfig } = require('../config');
const { StatusCodes } = require('http-status-codes');
const { ErrorResponse, SuccessResponse } = require('../utils/common');
const User = require('../models/User');
const { sendRechargeRejectionEmail, sendRechargeConfirmationEmail } = require('../services/email-service');

async function ensureLabelExists(gmail, labelName) {
    const res = await gmail.users.labels.list({ userId: 'me' });
    const label = res.data.labels.find(l => l.name === labelName);
    if (label) return label.id;
    const newLabel = await gmail.users.labels.create({
      userId: 'me',
      requestBody: { name: labelName }
    });
    return newLabel.data.id;
}

const getGmailClient = () => {
    const oauth2Client = new google.auth.OAuth2(
        ServerConfig.clientId,
        ServerConfig.clientSecret,
        ServerConfig.redirectUrl
    );

    // Set credentials
    oauth2Client.setCredentials({
        refresh_token: ServerConfig.refreshToken
    });
    return google.gmail({ version: 'v1', auth: oauth2Client });
};

const processRechargerequest = async() => {

}

//check recharge emails
const checkRechargeEmails = async () => {
    try {
        const gmail = getGmailClient();

        const processedLabelId = await ensureLabelExists(gmail, 'PROCESSED');

        //search emails
        const response = await gmail.users.messages.list({
            userId: 'me',
            q: 'subject:"recharge 5 credits" is:unread -label:PROCESSED',
            labelIds: ['INBOX'],
            maxResults: 10
        });
        console.log("response", response.data.messages);
        if (!response.data.messages) {
            ErrorResponse.message = 'No new recharge requests'
            return { Status: StatusCodes.NOT_FOUND, ErrorResponse};
        }
        // Process each email
        for (const message of response.data.messages) {
            try {
                const email = await gmail.users.messages.get({
                    userId: 'me',
                    id: message.id
                });
                // Extract sender's email
                const headers = email.data.payload.headers;
                const from = headers.find(h => h.name === 'From').value;
                const senderEmail = from.match(/<(.+?)>/)[1] || from;
                // Find user
                const user = await User.findOne({ email: senderEmail });
                if (!user) {
                    continue;
                }
                // Check if user has already recharged
                if (user.lastRechargeDate) {
                    await sendRechargeRejectionEmail(senderEmail);
                    continue;
                }
                // Process recharge
                user.credits = 5;
                user.lastRechargeDate = new Date();
                user.mailSent = false;
                await user.save();
                // Send confirmation email
                await sendRechargeConfirmationEmail(senderEmail, user.credits);
                 // Archive the processed email
                await gmail.users.messages.modify({
                    userId: 'me',
                    id: message.id,
                    requestBody: {
                    removeLabelIds: ['INBOX','UNREAD'],
                    addLabelIds: [processedLabelId]
                    }
                });
            } catch (error) {
                console.log("error1", error);
                throw error;
            }
        }
        //return res
        SuccessResponse.message = 'Recharge requests processed. If any valid requests were found, the credits have been added to the respective accounts.';
        SuccessResponse.data = {};
        return {Status: StatusCodes.OK, SuccessResponse}
    } catch (error) {
        console.log("error at credit controller", error);
        ErrorResponse.error = error;
        ErrorResponse.message = 'Something went wrong while processing recharge requests';
        return {Status: StatusCodes.INTERNAL_SERVER_ERROR, ErrorResponse};
    }
};

module.exports = {
    checkRechargeEmails
};