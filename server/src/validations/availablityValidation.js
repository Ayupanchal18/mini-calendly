import Joi from "joi";

export const AvailablityValidation = {
    availablityValidation(object) {
        const schema = Joi.object({
            Host: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
            BookingId: Joi.string().allow(null, ""),
            Date: Joi.string().required(),
            StartTime: Joi.string().required(),
            EndTime: Joi.string().required()
        });
        return schema.validate(object);
    },

    bookingValidation(object) {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            BookingId: Joi.string().required(),
            Date: Joi.string().required(),
            StartTime: Joi.string().required(),
            EndTime: Joi.string().required()
        });
        return schema.validate(object);
    },

    bookingLinkValidation(object) {
        const schema = Joi.object({
            token: Joi.string().required()
        });
        return schema.validate(object);
    },

    generateLinkValidation(object) {
        const schema = Joi.object({
            host: Joi.alternatives().try(Joi.number(), Joi.string()).required()
        });
        return schema.validate(object);
    }
};