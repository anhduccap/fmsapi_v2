const cron = require('node-cron');

module.exports = async () => {
    cron.schedule('0 7 * * 1,5', async () => {
        
    });
};
