const debug = require('util').debuglog('logger');
const sysLogger = console;

function Logger(namespace) {
    this.loggerName = namespace;
}

Logger.prototype.log = function (message, ...optionalParams) {
    let time = new Date().toLocaleString();
    sysLogger.log(`[${time}] [${this.loggerName}] \x1b[34m[info]\x1b[0m ` + message, ...optionalParams);
};

Logger.prototype.warn = function (message, ...optionalParams) {
    let time = new Date().toLocaleString();
    sysLogger.warn(`[${time}] [${this.loggerName}] \x1b[33m[warn]\x1b[0m ` + message, ...optionalParams);
};

Logger.prototype.error = function (message, ...optionalParams) {
    let time = new Date().toLocaleString();
    sysLogger.error(`[${time}] [${this.loggerName}] \x1b[31m[error]\x1b[0m ` + message, ...optionalParams);
};

const initLogger = function (namespace){
    debug('Creating new logger name %s', namespace);
    return new Logger(namespace);
};

module.exports = initLogger;