const { ErrorHandler } = require('../errors');
const {
    errMsg,
    statusCode,
} = require('../config');
const { CarModel } = require('../dataBase');

module.exports = {
    checkUniqueModel: async (req, res, next) => {
        try {
            const { model } = req.body;

            const carByModel = await CarModel.findOne({ model });

            if (carByModel) {
                throw new ErrorHandler(statusCode.CONFLICT, errMsg.MODEL_EXIST);
            }

            next();
        } catch (e) {
            next(e);
        }
    }
};
