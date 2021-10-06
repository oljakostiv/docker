const {
    constants: {
        FILE_MAX_SIZE,
        MIMETYPE
    },
    errMsg,
    statusCode
} = require('../config');
const { ErrorHandler } = require('../errors');

module.exports = {
    checkAvatar: (req, res, next) => {
        try {
            if (!req.files || !req.files.avatar) {
                next();
                return;
            }

            const {
                size,
                mimetype
            } = req.files.avatar;

            if (size > FILE_MAX_SIZE.PHOTO) {
                throw new ErrorHandler(statusCode.BAD_REQ, errMsg.FORBIDDEN);
            }

            if (!MIMETYPE.PHOTO.includes(mimetype)) {
                throw new ErrorHandler(statusCode.BAD_REQ, errMsg.WRONG_FILE_FORMAT);
            }

            next();
        } catch (e) {
            next(e);
        }
    }
};
