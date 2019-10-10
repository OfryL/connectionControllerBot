const namespace = 'connectionUtil';
const logger = require('../logger')(namespace);
const debug = require('util').debuglog(namespace);
const request = require('request');
const ifconfig = require('ifconfig');
const exec = require('child_process').exec;

//todo move to config
const ethName = 'en0';
const remoteUrl = 'https://www.google.com/';
const isWindows = true;

const getInterfaces = function () {
    return new Promise(function (resolve, reject) {
        ifconfig(function(err, configs) {
            if(err){
                reject(err);
            } else {
                resolve(configs);
            }
        });
    });
};

const execCmd = function (term) {
    return new Promise(function (resolve, reject) {
        exec(term, function(err, stdout, stderr) {
            if (err) {
                logger.error('error in exec: %s\n%s',err,stderr);
                reject(err);
            } else {
                resolve(stdout);
            }
        });
    });
};

const setInterface = async function (state) {
    if(isWindows) {
        if (state == 'down') {
            await execCmd(`netsh interface set interface "${ethName}" disable`);
        } else {
            await execCmd(`netsh interface set interface "${ethName}" enable`);
        }
    } else {
        await execCmd(`ifconfig ${ethName} ${state}`);
    }
};

const resetSystem = async function () {
    logger.warn('execute system reboot');
    if(isWindows) {
        await execCmd('shutdown -r -t 0');
    } else {
        await execCmd('reboot');
    }
};

const sleep = async function(time) {
    if(isWindows) {
        await execCmd('timeout ' + time);
    } else {
        await execCmd('sleep ' + time);
    }
};

const resetInterface = async function () {
    logger.log('restarting interface name %s', ethName);
    await setInterface('down');
    await sleep(5);
    await setInterface('up');
    await sleep(5);
};

const checkConnectionViaHttpRequest = function () {
    return new Promise(function (resolve, reject) {
    debug('check connection via http request started');
        request(remoteUrl, function (error, response, body) {
            if (error) {
                logger.warn(`error requesting ${remoteUrl} - ${error}`);
                resolve(0);
            } else {
                if (response.statusCode == 200) {
                    resolve(200);
                } else {
                    resolve(response.statusCode);
                }
            }
        });
    });
};


module.exports = {
    checkConnectionViaHttpRequest,
    setInterface,
    resetInterface,
    getInterfaces,
    resetSystem
};