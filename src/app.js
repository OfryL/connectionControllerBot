const logger = require('./logger')('app');
require('./keepAliveJob/keepAliveJob');

logger.debug('connectionController started');