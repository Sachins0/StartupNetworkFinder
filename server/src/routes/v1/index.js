const express= require('express');
const { infoController, authController, creditController, searchController } = require('../../controllers');
const authMiddleware = require('../../middlewares/auth-middleware');

const router=express.Router();

router.post('/auth/google', authController.googleLogin);
router.post('/search', authMiddleware, searchController.search);
router.get('/findAll', authMiddleware, searchController.findAllInvestors);
router.post('/credits/check-recharge-emails', creditController.checkRechargeEmails);

router.get('/info',infoController.info);

module.exports=router;