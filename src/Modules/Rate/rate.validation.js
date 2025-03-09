import Joi from "joi";

export const validateRate = (data) => {
    const schema = Joi.object({
        rateNumber: Joi.number().required().messages({
            "number.base": "Rate number must be a number",
            "any.required": "Rate number is required",
        }),
        comment: Joi.string().optional().allow(""),
        store_id: Joi.string().required().messages({
            "string.base": "Store ID must be a string",
            "any.required": "Store ID is required",
        }),
        user_id: Joi.string().required().messages({
            "string.base": "User ID must be a string",
            "any.required": "User ID is required",
        }),
    });

    return schema.validate(data, { abortEarly: false });
};
