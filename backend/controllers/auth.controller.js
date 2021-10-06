const {
    actions: { FORGOT_PASS },
    constants: {
        AUTHORIZATION,
        QUERY_TOKEN
    },
    emailActions,
    errMsg,
    statusCode,
    variables: {
        FRONTEND_URL_TOKEN,
    }
} = require('../config');
const {
    OAuthModel,
    ActionToken,
    UserModel
} = require('../dataBase');
const {
    emailService,
    jwtService,
    passwordService
} = require('../services');
const { userUtil: { calibrationUser } } = require('../util');

module.exports = {
    activateAccount: async (req, res, next) => {
        try {
            const {
                logUser: { _id },
                query: { token }
            } = req;

            await ActionToken.deleteOne({ token });
            await UserModel.updateOne({ _id }, { isActivated: true });

            res.status(statusCode.CREATED_AND_UPDATE)
                .send(errMsg.USER_ACTIVE);
        } catch (e) {
            next(e);
        }
    },

    authPostUser: async (req, res, next) => {
        try {
            const {
                authUser,
                body
            } = req;

            await passwordService.compare(authUser.password, body.password);

            await emailService.sendMail(
                authUser.email,
                emailActions.AUTH,
                {
                    userName: body.name
                }
            );

            const tokenPair = jwtService.giveTokenPair();

            await OAuthModel.create({
                ...tokenPair,
                user: authUser._id
            });

            res.json({
                ...tokenPair,
                user: calibrationUser(authUser)
            });
        } catch (e) {
            next(e);
        }
    },

    changePass: (isForgotten = true) => async (req, res, next) => {
        try {
            const {
                body: { password },
                logUser: { _id }
            } = req;
            const token = req.get(AUTHORIZATION);

            const passwordHashed = await passwordService.hash(password);

            if (isForgotten) {
                await ActionToken.deleteOne({ token });
            }

            await UserModel.updateOne({ _id }, { password: passwordHashed });
            await OAuthModel.deleteMany({ user: _id });

            res.status(statusCode.CREATED_AND_UPDATE)
                .json(errMsg.PASSWORD_UPDATE);
        } catch (e) {
            next(e);
        }
    },

    logoutUser: async (req, res, next) => {
        try {
            const access_token = req.get(AUTHORIZATION);
            await OAuthModel.deleteOne({ access_token });

            res.sendStatus(statusCode.DELETED);
        } catch (e) {
            next(e);
        }
    },

    refresh: async (req, res, next) => {
        try {
            const refresh_token = req.get(AUTHORIZATION);
            const user = req.logUser;

            const tokenPair = jwtService.giveTokenPair();

            await OAuthModel.updateOne({ refresh_token }, tokenPair);

            res.json({
                ...tokenPair,
                user: calibrationUser(user)
            });
        } catch (e) {
            next(e);
        }
    },

    mailForUserPass: async (req, res, next) => {
        try {
            const {
                name,
                _id,
                email
            } = req.item;

            const token = await jwtService.giveActionToken(FORGOT_PASS);

            await ActionToken.create({
                token,
                action: FORGOT_PASS,
                user: _id
            });

            await emailService.sendMail(
                email,
                emailActions.FORGOT_PASS,
                {
                    userName: name,
                    accTokenURL: `${FRONTEND_URL_TOKEN}${QUERY_TOKEN}${token}`
                }
            );

            res.status(statusCode.CREATED_AND_UPDATE)
                .send(errMsg.CHECK_MAIL);
        } catch (e) {
            next(e);
        }
    }
};
