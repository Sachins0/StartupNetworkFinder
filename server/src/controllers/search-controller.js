const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const {sendRechargeEmail, sendRechargeRejectionEmail} = require("../services/email-service");
const { ErrorResponse, SuccessResponse } = require("../utils/common");
const NetworkMember = require("../models/NetworkMember");
const findMatch = require("../services/ai-service");
const AppError = require("../utils/errors/app-error");


const search = async (req, res) => {
    try {
        //fetch query and userId
        const {query} = req.body;
        const userId = req.user._id;
        //find User
        const user = await User.findById(userId);
        //check credits
        if(user.credits <= 0){
            //send email
            if(!user.lastRechargeDate){
                await sendRechargeEmail(user.email);
                ErrorResponse.message = "Your credits are exhausted. Please check your email to recharge. Login again for the changes to take effect.";
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json(ErrorResponse)
            }
            else{
                await sendRechargeRejectionEmail(user.email);
                ErrorResponse.message = "Sorry, we are not offering additional credits at this time as you have already used your one-time recharge.";
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json(ErrorResponse)
            }
            
        }
        //findMatch
        const networkMembers = await NetworkMember.find();
        const match = await findMatch(query, networkMembers);
        //reduce credit and save user
        user.credits -= 1;
        await user.save();
        //return res
        SuccessResponse.message = "Match found successfully";
        SuccessResponse.data.match = match;
        SuccessResponse.data.remainingCredits = user.credits;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        ErrorResponse.message = 'Something went wrong while doing match search';
        return res
                .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse);
    }
};

module.exports = {
    search
};