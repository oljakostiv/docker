const { ErrorHandler } = require('../errors');
const {
    constants: {
        ADMIN,
        OWNER
    },
    errMsg,
    statusCode
} = require('../config');
const { UserModel } = require('../dataBase');

module.exports = {
    checkUniqueName: async (req, res, next) => {
        try {
            const { name } = req.body;

            const userByName = await UserModel.findOne({ name });

            if (userByName) {
                throw new ErrorHandler(statusCode.CONFLICT, errMsg.NAME_EXIST);
            }
            next();
        } catch (e) {
            next(e);
        }
    },

    checkUserRoleMiddle: (roleArr = []) => (req, res, next) => {
        try {
            const {
                logUser,
                params: { user_id }
            } = req;

            if (logUser._id.toString() === user_id.toString()) {
                req.deleteByUser = true;
                return next();
            }

            if (!roleArr.length) {
                return next();
            }

            if (!roleArr.includes(logUser.role)) {
                throw new ErrorHandler(statusCode.FORBIDDEN, errMsg.FORBIDDEN);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    checkIsAdmin: (req, res, next) => {
        try {
            const { role } = req.logUser;

            if (![
                ADMIN,
                OWNER
            ].includes(role)) {
                throw new ErrorHandler(statusCode.FORBIDDEN, errMsg.FORBIDDEN);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    isNotPresent: (req, res, next) => {
        try {
            const { logUser } = req;

            if (!logUser) {
                throw new ErrorHandler(statusCode.NOT_FOUND, errMsg.NOT_FOUND);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    updateMiddle: (req, res, next) => {
        try {
            const {
                logUser,
                params: { user_id }
            } = req;

            if (logUser._id.toString() !== user_id.toString()) {
                throw new ErrorHandler(statusCode.FORBIDDEN, errMsg.FORBIDDEN);
            }

            next();
        } catch (e) {
            next(e);
        }
    }
};
