import Joi from "joi";

export const validateUser = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(30).required().messages({
            "string.empty": "Username is required",
            "string.min": "Username must be at least 3 characters",
            "string.max": "Username must be at most 30 characters"
        }),
        email: Joi.string().email().required().messages({
            "string.empty": "Email is required",
            "string.email": "Email must be a valid email address"
        }),
        password: Joi.string().min(6).max(50).required().messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 6 characters",
            "string.max": "Password must be at most 50 characters"
        }),
        phoneNumber: Joi.string()
            .pattern(/^\+?[1-9]\d{1,14}$/)
            .required()
            .messages({
                "string.empty": "Phone number is required",
                "string.pattern.base": "Phone number must be a valid international format"
            }),
        points: Joi.number().integer().min(0).default(0).messages({
            "number.base": "Points must be a number",
            "number.integer": "Points must be an integer",
            "number.min": "Points cannot be negative"
        }),
    });

    return schema.validate(data, { abortEarly: false });
};
