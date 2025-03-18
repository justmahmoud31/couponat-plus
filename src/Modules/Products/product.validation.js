import Joi from "joi";

export const validateProduct = (data) => {
    const schema = Joi.object({
        title: Joi.string().required().messages({ "string.empty": "Title is required" }),
        description: Joi.string().allow("").optional(),
        images:Joi.array().items(Joi.string().allow(null)).optional().allow(null),
        cover_image: Joi.string().optional().allow(null),
        link: Joi.string().uri().allow("").optional().messages({
            "string.uri": "Link must be a valid URL",
        }),
        code: Joi.string().allow("").optional(),
        brand_name: Joi.string().allow("").optional(),
        price: Joi.number().min(0).optional().messages({
            "number.base": "Price must be a number",
            "number.min": "Price cannot be negative",
        }),
        discounted_price: Joi.number().min(0).optional().messages({
            "number.base": "Discounted price must be a number",
            "number.min": "Discounted price cannot be negative",
        }),
        category_id: Joi.string().optional().messages({
            "string.base": "Category ID must be a string",
        })
    });

    return schema.validate(data, { abortEarly: false });
};
