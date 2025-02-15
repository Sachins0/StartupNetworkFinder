const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const {sendRechargeEmail, sendRechargeRejectionEmail} = require("../services/email-service");
const { ErrorResponse, SuccessResponse } = require("../utils/common");
const NetworkMember = require("../models/NetworkMember");
const findMatch = require("../services/ai-service");


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
            if(!user.lastRechargeDate ){
                if(user.mailSent === false){
                    await sendRechargeEmail(user.email);
                    user.mailSent = true;
                    await user.save();
                }
                ErrorResponse.message = "Your credits are exhausted. Please check your email to recharge. Wait for 5 minutes and Login again for the changes to take effect.";
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json(ErrorResponse)
            }
            else{
                if(user.mailSent === false){
                    await sendRechargeRejectionEmail(user.email);
                    user.mailSent = true;
                    await user.save();
                }
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
        SuccessResponse.data = {};
        SuccessResponse.data.match = match;
        SuccessResponse.data.remainingCredits = user.credits;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        console.log("error at search controller", error);
        ErrorResponse.error = error;
        ErrorResponse.message = 'Something went wrong while doing match search. Too may request. Try again after some time';
        return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse);
    }
};

const findAllInvestors = async (req, res) => {
    try {
        const investors = await NetworkMember.find({}).sort({ name: 1 });
        SuccessResponse.message = 'Investors fetched successfully';
        SuccessResponse.data = investors;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
      } catch (error) {
        console.log("error at find all", error);
        ErrorResponse.error = error;
        ErrorResponse.message = 'Error fetching investors';
        return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse);
      }
};

module.exports = {
    search,
    findAllInvestors
};