const { Schema, model } = require('mongoose');

const { dbTab: { OAUTH, USER } } = require('../config');

const OAuthSchema = new Schema({
    access_token: {
        type: String,
        required: true
    },
    refresh_token: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: USER
    }
}, { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } });

OAuthSchema.pre('findOne', function() {
    this.populate(USER);
});

module.exports = model(OAUTH, OAuthSchema);
