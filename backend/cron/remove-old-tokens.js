const dayJs = require('dayjs');
const utc = require('dayjs/plugin/utc');

dayJs.extend(utc);

const { constants: { MONTH } } = require('../config');
const {
    OAuthModel,
    ActionToken
} = require('../dataBase');

module.exports = async () => {
    const previousMonth = dayJs.utc()
        .subtract(1, MONTH);

    await OAuthModel.deleteMany({ createdAt: { $lte: previousMonth } });
    await ActionToken.deleteMany({ createdAt: { $lte: previousMonth } });
};
