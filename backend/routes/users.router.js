const router = require('express')
    .Router();

const { usersController } = require('../controllers');
const {
    actions: { ADMIN_PASS },
    constants: {
        BODY,
        ID,
        QUERY,
        PARAMS,
        USER_ID
    },
    userRole: {
        ADMIN,
        OWNER
    }
} = require('../config');
const { UserModel } = require('../dataBase');
const {
    authMiddle,
    fileMiddle,
    mainMiddle,
    userMiddle
} = require('../middlewares');
const {
    userValidator: {
        queryUserValidator,
        updateUserValidator,
        paramsUserValidator,
        passwordValidator,
        createUserValidator,
    }
} = require('../validators');

router.get('/',
    mainMiddle.isDataValid(queryUserValidator, QUERY),
    usersController.getAllUsers);

router.post('/',
    mainMiddle.isDataValid(createUserValidator, BODY),
    fileMiddle.checkAvatar,
    userMiddle.checkUniqueName,
    usersController.setUser);

router.post('/admin/create',
    mainMiddle.isDataValid(createUserValidator, BODY),
    fileMiddle.checkAvatar,
    authMiddle.validateAccessToken,
    userMiddle.checkIsAdmin,
    userMiddle.checkUniqueName,
    usersController.setAdmin);

router.post('/admin/set',
    mainMiddle.isDataValid(passwordValidator, BODY),
    authMiddle.validateActionToken(ADMIN_PASS),
    usersController.changePassForAdmin);

router.delete('/:user_id',
    mainMiddle.isDataValid(paramsUserValidator),
    authMiddle.validateAccessToken,
    mainMiddle.getItemByDynamicParam(UserModel, USER_ID, PARAMS, ID),
    userMiddle.isNotPresent,
    userMiddle.checkUserRoleMiddle([
        ADMIN,
        OWNER
    ]),
    usersController.deleteUser);

router.get('/:user_id',
    mainMiddle.isDataValid(paramsUserValidator),
    mainMiddle.getItemByDynamicParam(UserModel, USER_ID, PARAMS, ID),
    usersController.getSingleUser);

router.put('/:user_id',
    mainMiddle.isDataValid(paramsUserValidator),
    mainMiddle.isDataValid(updateUserValidator, BODY),
    fileMiddle.checkAvatar,
    authMiddle.validateAccessToken,
    mainMiddle.getItemByDynamicParam(UserModel, USER_ID, PARAMS, ID),
    userMiddle.updateMiddle,
    userMiddle.checkUniqueName,
    usersController.updateUser);

module.exports = router;
