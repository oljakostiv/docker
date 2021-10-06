const {
    Schema,
    model
} = require('mongoose');

const {
    dbTab: { USER },
    emailActions,
    userRole,
    variables: {
        OWNER_BORN_YEAR,
        OWNER_EMAIL,
        OWNER_NAME,
        OWNER_PASSWORD
    }
} = require('../config');
const emailService = require('../services/email.service');
const passwordService = require('../services/password.service');
// don't use index file

const userSchema = new Schema({
    name: {
        type: String,
        unique: true,
        require: true,
        trim: true
    },
    born_year: {
        type: Number,
        trim: true
    },
    role: {
        type: String,
        default: userRole.USER,
        enum: Object.values(userRole)
    },
    email: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        require: true,
        trim: true,
        // select: false
    },
    isActivated: {
        type: Boolean,
        required: true,
        default: false
    },
    avatar: {
        type: String

    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

userSchema.statics = {
    async setOwner() {
        const count = await this.findOne({ role: userRole.OWNER });

        if (!count) {
            const password = await passwordService.hash(OWNER_PASSWORD);

            this.create({
                name: OWNER_NAME,
                born_year: OWNER_BORN_YEAR,
                role: userRole.OWNER,
                email: OWNER_EMAIL,
                isActivated: true,
                password
            });

            await emailService.sendMail(
                OWNER_EMAIL,
                emailActions.SET_OWNER,
                {
                    userName: OWNER_NAME,
                }
            );
        }
    }
};

module.exports = model(USER, userSchema);
