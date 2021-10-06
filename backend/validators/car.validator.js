const Joi = require('joi');

const {
    constants,
    carType
} = require('../config');

const modelSchema = Joi.string()
    .alphanum()
    .min(2)
    .max(30)
    .trim()
    .required();

const createCarValidator = Joi.object({
    model: modelSchema,
    type: Joi.string()
        .allow(...Object.values(carType)),
    year: Joi.number()
        .min(constants.CURRENT_YEAR - 20)
        .max(constants.CURRENT_YEAR)
        .required(),
    price: Joi.number()
        .min(888)
        .max(888888)
        .required()
});

const paramsCarValidator = Joi.object({
    car_id: Joi.string()
        .regex(constants.ID_REGEXP)
        .trim()
});

const queryCarValidator = Joi.object({
    model: Joi.string()
        .alphanum()
        .min(2)
        .max(30)
        .trim(),
    year_lte: Joi.number()
        .min(constants.CURRENT_YEAR - 20)
        .max(constants.CURRENT_YEAR),
    year_gte: Joi.number()
        .min(constants.CURRENT_YEAR - 20)
        .max(constants.CURRENT_YEAR),
    price: Joi.number()
        .min(888)
        .max(888888),
    page: Joi.number().min(1),
    perPage: Joi.number().min(1),
    order: Joi.string(),
    sortBy: Joi.string()
});

const updateCarValidator = Joi.object({
    model: modelSchema,
    type: Joi.string()
        .allow(...Object.values(carType)),
    year: Joi.number()
        .min(constants.CURRENT_YEAR - 20)
        .max(constants.CURRENT_YEAR),
    price: Joi.number()
        .min(888)
        .max(888888)
});

module.exports = {
    createCarValidator,
    paramsCarValidator,
    queryCarValidator,
    updateCarValidator
};
