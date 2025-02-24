import Joi from "joi";

export const validateCoupon = (data) => {
    const schema = Joi.object({
        title: Joi.string().required().messages({
            "string.empty": "Title is required",
        }),
        description: Joi.string().allow("").optional(),
        image: Joi.string().uri().allow("").optional().messages({
            "string.uri": "Image must be a valid URL",
        }),
        cover_image: Joi.string().uri().allow("").optional().messages({
            "string.uri": "Cover image must be a valid URL",
        }),
        link: Joi.string().uri().allow("").optional().messages({
            "string.uri": "Link must be a valid URL",
        }),
        category_id: Joi.string().optional().messages({
            "string.base": "Category ID must be a string",
        }),
        related_coupons: Joi.array().items(Joi.string()).optional().messages({
            "array.base": "Related coupons must be an array of strings",
        }),
    });

    return schema.validate(data, { abortEarly: false });
};
