const logger = require('../logger')('app.keepAliveJob');
const cron = require('node-cron');
const util = require('../connectionUtil/connectionUtil');

//todo config
const cornExpression = '0 * * * *';  // check every 1h
const retries = 5;
const panicRestart = true;

module.exports = function() {
    'use strict';
    let status;

    const jobRunner = async function () {
        let tries = 0;
        while (tries < retries) {
            const connectionStatus = await util.checkConnectionViaHttpRequest();
            if (connectionStatus != 200) {
                logger.warn('connection is down');
                logger.log(`trying to restart network interface (${tries} of ${retries} attempts)`);
                await util.resetInterface();
                logger.log('connection was reset');
                tries++;
            } else {
                logger.debug('connection is OK!');
                break;
            }
        }
        if(panicRestart && tries == retries) {
            logger.warn('max tries reached, rebooting system...');
            util.resetSystem();
        }
    };

    const setupJob = function (jobRunner) {
        logger.log('creating corn job');
        if(!cron.validate(cornExpression)) {
            logger.error('corn job expression is wrong!');
        }
        cron.schedule(cornExpression, () => {
            logger.debug('executing corn job');
            jobRunner();
        });
        status = true;
    }(jobRunner);

    return {
        status
    };
}();