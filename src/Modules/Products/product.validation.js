import Joi from "joi";

export const validateProduct = (data) => {
    const schema = Joi.object({
        title: Joi.string().required().messages({ "string.empty": "Title is required" }),
        description: Joi.string().allow("").optional(),
        images: Joi.array().items(Joi.string()).optional().messages({
            "array.base": "Images must be an array of strings (file paths)",
        }),
        cover_image: Joi.string().optional(),
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
        }),
        related_product: Joi.array().items(Joi.string()).optional().messages({
            "array.base": "Related products must be an array of product IDs",
        }),
    });

    return schema.validate(data, { abortEarly: false });
};
