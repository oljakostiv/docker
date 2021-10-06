const {
    constants: { PASSWORD, __V },
} = require('../config');

module.exports = {
    calibrationUser: (userToCalibrate) => {
        const fieldsToRemove = [
            PASSWORD,
            __V
        ];

        userToCalibrate = userToCalibrate.toObject();

        fieldsToRemove.forEach((field) => {
            delete userToCalibrate[field];
        });

        return userToCalibrate;
    }
};
