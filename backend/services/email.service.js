const EmailTemplates = require('email-templates');
const nodemailer = require('nodemailer');
const path = require('path');

const {
    constants: { FROM, GMAIL },
    errMsg,
    statusCode,
    variables: {
        FRONTEND_URL,
        NO_REPLY_EMAIL,
        NO_REPLY_PASSWORD
    },
} = require('../config');
const templateInfo = require('../email-templates');
const { ErrorHandler } = require('../errors');

const templateParser = new EmailTemplates({
    views: {
        root: path.join(process.cwd(), 'email-templates')
    }
});

const transporter = nodemailer.createTransport({
    service: GMAIL,
    auth: {
        user: NO_REPLY_EMAIL,
        pass: NO_REPLY_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});
const sendMail = async (userMail, action, context = {}) => {
    const template = templateInfo[action];

    if (!template) {
        throw new ErrorHandler(statusCode.SERVER_ERROR, errMsg.TEMPLATE_NAME_WRONG);
    }

    const {
        templateName,
        subject
    } = template;

    context = { ...context, frontendURL: FRONTEND_URL };

    const html = await templateParser.render(templateName, context);

    return transporter.sendMail({
        from: FROM,
        to: userMail,
        subject,
        html
    });
};

module.exports = {
    sendMail
};
