const cron = require('node-cron');
const {creditController} = require('../../controllers');

function scheduleCrons(){
    cron.schedule('*/1 * * * *', async() => {
        try {
            await creditController.checkRechargeEmails();
            console.log('Scheduled recharge check completed');
        } catch (error) {
            console.error('Error in scheduled recharge check:', error);
        }
    });
}

module.exports= scheduleCrons;