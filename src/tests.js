
const debug = require('util').debuglog('tests');
const logger = require('./logger')('tests');
const assert = require('assert');
const ifconfig = require('ifconfig');
const request = require('request');

logger.log('running tests...');

testIfConfigLib = function () {
    logger.log('testing ifconfig...');
    ifconfig(function(err, configs) {
        if(err){
            assert.fail(`error getting ifconfig ${err}`);
        } else {
            debug('got json: %j', configs);
            assert(configs, 'ifconfig returns empty data');
            logger.log('done testing ifconfig...');
        }
    });
}();

testRequest = function () {
    const url = 'https://www.google.com/';
    logger.log('testing request...');
    request(url, function(error, response, body) {
        if(error){
            assert.fail(`error requesting ${url} - ${error}`);
        } else {
            debug('got response: %o\nWith headers: %o', response.statusCode, response.headers);
            assert(response, 'request returns empty data');
            assert(response.statusCode == 200, 'request returns error code');
            logger.log('done testing request...');
        }
    });
}();