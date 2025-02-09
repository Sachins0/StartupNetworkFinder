const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');
const {ServerConfig} = require('../config');
const { ErrorResponse } = require('../utils/common');
const User = require('../models/User');

//auth
const auth = async(req, res, next) => {
    try {
        //extract token
        const token = req.header('Authorization').replace('Bearer', '')?.trim();
        if(!token){
            ErrorResponse.message = 'Token is missing';
            return res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json(ErrorResponse)
        };
        //verify token
        try {
            const decode = jwt.verify(token, ServerConfig.jwtSecret);
            const user = await User.findById(decode.userId);

            if (!user) {
                ErrorResponse.message = 'User not found';
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json(ErrorResponse)
            }
            req.user = user;
            req.token = token;
        } catch (error) {
            ErrorResponse.error = error;
            ErrorResponse.message = 'Invalid token';
            return res
                    .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
                    .json(ErrorResponse);
        }
   
        next();
   
      } catch (error) {
        ErrorResponse.error = error;
        ErrorResponse.message = 'Something went wrong while authenticating';
        return res
                .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse);
      }
};

module.exports = auth;