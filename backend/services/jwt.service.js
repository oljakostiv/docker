const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const {
    actions: { FORGOT_PASS, ADMIN_PASS },
    constants: { ACCESS },
    errMsg,
    statusCode,
    variables: {
        ACCESS_SECRET_KEY,
        ADMIN_KEY,
        BACKEND_KEY,
        REFRESH_SECRET_KEY
    }
} = require('../config');
const { ErrorHandler } = require('../errors');

const verifyPromise = promisify(jwt.verify);

module.exports = {
    giveTokenPair: () => {
        const access_token = jwt.sign({}, ACCESS_SECRET_KEY, { expiresIn: '15m' });
        const refresh_token = jwt.sign({}, REFRESH_SECRET_KEY, { expiresIn: '31d' });

        return {
            access_token,
            refresh_token
        };
    },

    verifyToken: async (token, tokenType = ACCESS) => {
        try {
            const secretInfo = tokenType === ACCESS ? ACCESS_SECRET_KEY : REFRESH_SECRET_KEY;

            await verifyPromise(token, secretInfo);
        } catch (e) {
            throw new ErrorHandler(statusCode.UNAUTHORIZED, errMsg.INVALID_TOKEN);
        }
    },

    giveActionToken: (actionType) => {
        const { secretWord, expiresIn } = _getSecretWordForActionToken(actionType);

        return jwt.sign({}, secretWord, { expiresIn });
    },

    verifyActionToken: (token, actionType) => {
        const { secretWord } = _getSecretWordForActionToken(actionType);

        return jwt.verify(token, secretWord);
    }
};

function _getSecretWordForActionToken(actionType) {
    let secretWord = '';
    let expiresIn = '22m';

    switch (actionType) {
        case FORGOT_PASS:
            secretWord = BACKEND_KEY;
            expiresIn = '60m';
            break;
        case ADMIN_PASS:
            secretWord = ADMIN_KEY;
            expiresIn = '1d';
            break;
        default:
            throw new ErrorHandler(statusCode.BAD_REQ, errMsg.INCORRECT);
    }

    return { secretWord, expiresIn };
}
