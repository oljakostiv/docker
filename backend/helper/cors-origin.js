const {
    constants: { DEV, SEPARATOR },
    errMsg,
    statusCode,
    variables: { ALLOWED_ORIGINS }
} = require('../config');
const { ErrorHandler } = require('../errors');

function _configureCors(origin, callback) {
    const whiteList = ALLOWED_ORIGINS.split(SEPARATOR);

    if (!origin && process.env.NODE_ENV === DEV) {
        return callback(null, true);
    }

    if (!whiteList.includes(origin)) {
        return callback(new ErrorHandler(statusCode.FORBIDDEN, errMsg.CORS), false);
    }

    return callback(null, true);
}

module.exports = {
    _configureCors
};
