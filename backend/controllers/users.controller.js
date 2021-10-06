const { v1 } = require('uuid');

const {
    actions: {
        ACTIVATE_ACCOUNT,
        ACTIVATE_ADMIN,
        ADMIN_PASS
    },
    constants: {
        ADMIN,
        AUTHORIZATION,
        QUERY_TOKEN,
        USERS
    },
    emailActions,
    errMsg,
    statusCode,
    variables: {
        ACTIVATE_URL
    }
} = require('../config');
const {
    UserModel,
    ActionToken
} = require('../dataBase');
const {
    emailService,
    mainService: {
        deleteItem,
        setItem
    },
    passwordService,
    jwtService,
    s3Service: {
        uploadFile,
        deleteFile
    },
    userService
} = require('../services');
const { userUtil } = require('../util');

module.exports = {
    deleteUser: async (req, res, next) => {
        try {
            const {
                deleteByUser,
                item: {
                    name,
                    email,
                    avatar
                },
                params: { user_id }
            } = req;

            if (avatar) {
                await deleteFile(avatar);
            }

            await deleteItem(UserModel, user_id);

            if (deleteByUser) {
                await emailService.sendMail(
                    email,
                    emailActions.DELETE_BY_USER,
                    { userName: name }
                );
            } else {
                await emailService.sendMail(
                    email,
                    emailActions.DELETE_BY_ADMIN,
                    { userName: name }
                );
            }

            res.sendStatus(statusCode.DELETED);
        } catch (e) {
            next(e);
        }
    },

    getAllUsers: async (req, res, next) => {
        try {
            const usersAll = await userService.getAll(req.query);

            const userToReturn = usersAll.map((user) => userUtil.calibrationUser(user));

            res.json(userToReturn);
        } catch (e) {
            next(e);
        }
    },

    getSingleUser: (req, res, next) => {
        try {
            const userToReturn = userUtil.calibrationUser(req.item);
            res.json(userToReturn);
        } catch (e) {
            next(e);
        }
    },

    changePassForAdmin: async (req, res, next) => {
        try {
            const {
                body: { password },
                logUser: { _id }
            } = req;
            const token = req.get(AUTHORIZATION);

            const passwordHashed = await passwordService.hash(password);

            await UserModel.updateOne({ _id }, { password: passwordHashed });

            await ActionToken.deleteOne({ token });

            res.status(statusCode.CREATED_AND_UPDATE)
                .json(errMsg.PASSWORD_UPDATE);
        } catch (e) {
            next(e);
        }
    },

    setAdmin: async (req, res, next) => {
        try {
            const {
                body: {
                    name,
                    password
                },
                logUser: { name: adminName }
            } = req;

            const passwordHashed = await passwordService.hash(password);
            const token = await jwtService.giveActionToken(ADMIN_PASS);

            let usersSet = await setItem(UserModel, {
                ...req.body,
                password: passwordHashed,
                role: ADMIN
            });

            if (req.files && req.files.avatar) {
                const { Location } = await uploadFile(req.files.avatar, USERS, usersSet._id);

                usersSet = await UserModel.findByIdAndUpdate(
                    usersSet._id,
                    { avatar: Location },
                    { new: true }
                );
            }

            await ActionToken.create({
                action: ACTIVATE_ADMIN,
                token,
                user: usersSet._id
            });

            await emailService.sendMail(
                usersSet.email,
                emailActions.SET_ADMIN,
                {
                    userName: name,
                    token,
                    adminName
                }
            );

            res.sendStatus(statusCode.CREATED_AND_UPDATE);
        } catch (e) {
            next(e);
        }
    },

    setUser: async (req, res, next) => {
        try {
            const {
                name,
                password
            } = req.body;

            const passwordHashed = await passwordService.hash(password);
            const token = v1();

            let usersSet = await setItem(UserModel, {
                ...req.body,
                password: passwordHashed
            });

            if (req.files && req.files.avatar) {
                const { Location } = await uploadFile(req.files.avatar, USERS, usersSet._id);

                usersSet = await UserModel.findByIdAndUpdate(
                    usersSet._id,
                    { avatar: Location },
                    { new: true }
                );
            }

            await ActionToken.create({
                action: ACTIVATE_ACCOUNT,
                token,
                user: usersSet._id
            });

            await emailService.sendMail(
                usersSet.email,
                emailActions.WELCOME,
                {
                    userName: name,
                    activateURL: `${ACTIVATE_URL}${QUERY_TOKEN}${token}`
                }
            );

            const userToReturn = userUtil.calibrationUser(usersSet);

            res.status(statusCode.CREATED_AND_UPDATE)
                .json(userToReturn);
        } catch (e) {
            next(e);
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const {
                logUser: {
                    name,
                    email
                }
            } = req;

            let { item } = req;

            if (req.files && req.files.avatar) {
                if (item.avatar) {
                    await deleteFile(item.avatar);
                }

                const { Location } = await uploadFile(req.files.avatar, USERS, item._id);

                req.body.avatar = Location;
            }

            item = await UserModel.findByIdAndUpdate(
                item._id,
                req.body,
                { new: true }
            );

            const userToReturn = userUtil.calibrationUser(item);

            await emailService.sendMail(
                email,
                emailActions.UPDATE_USER,
                { userName: name }
            );

            res.status(statusCode.CREATED_AND_UPDATE)
                .json(userToReturn);
        } catch (e) {
            next(e);
        }
    }
};
