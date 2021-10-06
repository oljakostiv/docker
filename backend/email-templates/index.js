const { emailActions } = require('../config');

module.exports = {
    [emailActions.AUTH]: {
        templateName: 'auth',
        subject: ' Authorization success.'
    },

    [emailActions.DELETE_BY_ADMIN]: {
        templateName: 'delete-by-admin',
        subject: 'User was deleted.'
    },

    [emailActions.DELETE_BY_USER]: {
        templateName: 'delete-by-user',
        subject: 'User was deleted.'
    },

    [emailActions.FORGOT_PASS]: {
        templateName: 'forgot-password',
        subject: 'forgot password'
    },

    [emailActions.REMINDER]: {
        templateName: 'reminder',
        subject: 'reminder for user'
    },

    [emailActions.SET_ADMIN]: {
        templateName: 'setAdmin',
        subject: 'Create admin'
    },

    [emailActions.SET_OWNER]: {
        templateName: 'setOwner',
        subject: 'Create owner'
    },

    [emailActions.UPDATE_USER]: {
        templateName: 'update-user',
        subject: 'Updated user info.'
    },

    [emailActions.WELCOME]: {
        templateName: 'welcome',
        subject: 'Welcome!'
    }
};
