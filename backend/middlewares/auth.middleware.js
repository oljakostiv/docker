const {
    constants: {
        AUTHORIZATION,
        REFRESH
    },
    errMsg,
    actions: { ACTIVATE_ACCOUNT },
    statusCode
} = require('../config');
const {
    ActionToken,
    OAuthModel,
    UserModel
} = require('../dataBase');
const { ErrorHandler } = require('../errors');
const {
    passwordService,
    jwtService: {
        verifyToken,
        verifyActionToken
    }
} = require('../services');

module.exports = {
    isAccActive: async (req, res, next) => {
        try {
            const { token } = req.query;

            if (!token) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, errMsg.NO_TOKEN);
            }

            const userWithToken = await ActionToken.findOne({
                token,
                action: ACTIVATE_ACCOUNT
            });

            if (!userWithToken) {
                throw new ErrorHandler(statusCode.NOT_FOUND, errMsg.ERROR_ACTIVATING);
            }

            req.logUser = userWithToken.user;

            next();
        } catch (e) {
            next(e);
        }
    },

    foundUser: async (req, res, next) => {
        try {
            const { name } = req.body;

            const authUser = await UserModel.findOne({ name });

            if (!authUser) {
                throw new ErrorHandler(statusCode.NOT_FOUND, errMsg.EMAIL_PASSWORD_WRONG);
            }

            req.authUser = authUser;

            next();
        } catch (e) {
            next(e);
        }
    },

    checkPasswordExist: async (req, res, next) => {
        try {
            const {
                logUser,
                body: { oldPassword }
            } = req;

            await passwordService.compare(logUser.password, oldPassword);

            next();
        } catch (e) {
            next(e);
        }
    },

    validateActionToken: (action) => async (req, res, next) => {
        try {
            const token = req.get(AUTHORIZATION);

            if (!token) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, errMsg.NO_TOKEN);
            }

            await verifyActionToken(token, action);

            const tokenFromDB = await ActionToken.findOne({
                token
            });

            if (!tokenFromDB) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, errMsg.INVALID_TOKEN);
            }

            req.logUser = tokenFromDB.user;

            next();
        } catch (e) {
            next(e);
        }
    },

    validateAccessToken: async (req, res, next) => {
        try {
            const access_token = req.get(AUTHORIZATION);

            if (!access_token) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, errMsg.NO_TOKEN);
            }

            await verifyToken(access_token);

            const tokenFromDB = await OAuthModel.findOne({ access_token });

            if (!tokenFromDB) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, errMsg.INVALID_TOKEN);
            }

            req.logUser = tokenFromDB.user;

            next();
        } catch (e) {
            next(e);
        }
    },

    validateRefreshToken: async (req, res, next) => {
        try {
            const refresh_token = req.get(AUTHORIZATION);

            if (!refresh_token) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, errMsg.NO_TOKEN);
            }

            await verifyToken(refresh_token, REFRESH);

            const tokenFromDB = await OAuthModel.findOne({ refresh_token });

            if (!tokenFromDB) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, errMsg.INVALID_TOKEN);
            }

            req.logUser = tokenFromDB.user;

            next();
        } catch (e) {
            next(e);
        }
    },
};
