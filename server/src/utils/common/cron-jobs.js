const cron = require('node-cron');
const {creditController} = require('../../controllers');

function scheduleCrons(){
    cron.schedule('*/5 * * * *', async() => {
        await creditController.checkRechargeEmails();
    });
}

module.exports= scheduleCrons;