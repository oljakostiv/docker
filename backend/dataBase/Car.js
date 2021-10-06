const { Schema, model } = require('mongoose');

const { dbTab: { CAR }, carType } = require('../config');

const carSchema = new Schema({
    model: {
        type: String,
        require: true,
        trim: true
    },
    type: {
        type: String,
        default: carType.SEDAN,
        enum: Object.values(carType)
    },
    year: {
        type: Number,
        require: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
}, { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } });

module.exports = model(CAR, carSchema);
