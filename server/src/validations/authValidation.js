import Joi from "joi";

export const Validation = {

    async loginValidation(object) {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })

        try {
            await schema.validateAsync(object)
        } catch (error) {
            console.log("Login validation error", error)
            return error.details[0].message;
        }
    },

    async SignupValidation(object) {
        const schema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })

        try {
            await schema.validateAsync(object)
        } catch (error) {
            console.log("Signup validation error", error)
            return error.details[0].message;
        }
    }
}