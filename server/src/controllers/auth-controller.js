const { ServerConfig } = require("../config");
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const {SuccessResponse, ErrorResponse} = require('../utils/common');
const { StatusCodes } = require("http-status-codes");


//googleLogin
const googleLogin = async (req, res) => {
    try {
        //email -> req.body
        const {email} = req.body;
        //find user
        let user = await User.findOne({email});
        //create user
        if(!user){
            user = await User.create({email, credits : 5});
        }
        //gen JWT
        const token = jwt.sign(
            {userId : user._id},
            ServerConfig.jwtSecret,
            {expiresIn: '24h'}
        );
        //return res
        SuccessResponse.message = 'Logged in successfully';
        SuccessResponse.data = {};
        SuccessResponse.data.token = token;
        SuccessResponse.data.credits = user.credits;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch (error) {
        console.log("error at auth controller", error);
        ErrorResponse.error = error;
        ErrorResponse.message = 'Something went wrong while logging in';
        return res
                .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse);
    }
};

module.exports = {
    googleLogin
};