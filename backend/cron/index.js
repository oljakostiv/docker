const cron = require('node-cron');

const { constants: { CRON_TEN_DAYS_SEND_EMAIL, CRON_ONE_DAY_TOKEN } } = require('../config');
const removeOldTokens = require('./remove-old-tokens');
const sendEmail = require('./send-email');

module.exports = () => {
    cron.schedule(CRON_ONE_DAY_TOKEN, async () => {
        console.log(`Cron started at ${new Date().toISOString()}`);
        await removeOldTokens();
        console.log(`Cron finished at ${new Date().toISOString()}`);
    });

    cron.schedule(CRON_TEN_DAYS_SEND_EMAIL, async () => {
        console.log(`Cron started at ${new Date().toISOString()}`);
        await sendEmail();
        console.log(`Cron finished at ${new Date().toISOString()}`);
    });
};
