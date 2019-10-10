const namespace = 'app';
const logger = require('./logger')(namespace);
const debug = require('util').debuglog(namespace);
require('./keepAliveJob/keepAliveJob');

logger.log('connectionController started');