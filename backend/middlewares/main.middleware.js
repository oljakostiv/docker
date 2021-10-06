const { ErrorHandler } = require('../errors');
const {
    errMsg,
    statusCode,
    constants: {
        PARAMS,
        BODY
    }
} = require('../config');

module.exports = {
    getItemByDynamicParam: (itemModel, paramName, searchIn = BODY, dbFiled = paramName) => async (req, res, next) => {
        try {
            const dynamicValue = req[searchIn][paramName];

            const item = await itemModel.findOne({ [dbFiled]: dynamicValue });

            if (!item) {
                throw new ErrorHandler(statusCode.NOT_FOUND, errMsg.NOT_FOUND);
            }

            req.item = item;

            next();
        } catch (e) {
            next(e);
        }
    },

    isDataValid: (validator, searchIn = PARAMS) => (req, res, next) => {
        try {
            const { error } = validator.validate(req[searchIn]);

            if (error) {
                throw new ErrorHandler(statusCode.BAD_REQ, errMsg.NOT_VALID);
            }

            next();
        } catch (e) {
            next(e);
        }
    }
};
