import Joi from "joi";

export const validateCoupon = (data) => {
    const schema = Joi.object({
        title: Joi.string().required().messages({
            "string.empty": "Title is required",
        }),
        code: Joi.string().required().messages({
            "string.base": "Code is Required"
        }),
        type: Joi.string().required().messages({
            "string.base": "Type is Required"
        }),
        expireDate : Joi.date().optional(),
        description: Joi.string().allow("").optional(),
        image: Joi.string().optional().allow(null),
        cover_image: Joi.string().optional().allow(null),
        link: Joi.string().uri().allow("").optional().messages({
            "string.uri": "Link must be a valid URL",
        }),
        category_id: Joi.string().optional().messages({
            "string.base": "Category ID must be a string",
        }),
        store_id: Joi.string().optional().messages({
            "string.base": "Store ID must be a string",
        }),
        related_coupons: Joi.array().items(Joi.string()).optional().messages({
            "array.base": "Related coupons must be an array of strings",
        }),
    });

    return schema.validate(data, { abortEarly: false });
};
