const namespace = 'keepAliveJob';
const logger = require('../logger')(namespace);
const debug = require('util').debuglog(namespace);
const cron = require('node-cron');
const util = require('../connectionUtil/connectionUtil');

//todo config
const cornExpression = '0 * * * *';  // check every 1h
const retries = 5;

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
                debug('connection is OK!');
                break;
            }
        }
    };

    const setupJob = function (jobRunner) {
        logger.log('creating corn job');
        if(!cron.validate(cornExpression)) {
            logger.error('corn job expression is wrong!');
        }
        cron.schedule(cornExpression, () => {
            debug('executing corn job');
            jobRunner();
        });
        status = true;
    }(jobRunner);

    return {
        status
    };
}();