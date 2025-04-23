import Joi from "joi";

export const validateCategory = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Category name is required",
    }),
    image: Joi.string().allow("").optional().messages({
      "string.uri": "Image must be a valid URL",
    }),
    parent_id: Joi.alternatives()
      .try(
        Joi.string().hex().length(24), // Valid MongoDB ID
        Joi.string().allow(""), // Empty string
        Joi.allow(null) // Null value
      )
      .optional()
      .messages({
        "string.hex": "Parent ID must be a valid MongoDB ObjectId",
        "string.length": "Parent ID must be exactly 24 characters long",
      }),
    sub_categories: Joi.array()
      .items(
        Joi.string().hex().length(24).messages({
          "string.hex": "Each sub-category ID must be a valid MongoDB ObjectId",
          "string.length":
            "Each sub-category ID must be exactly 24 characters long",
        })
      )
      .optional()
      .messages({
        "array.base": "Subcategories must be an array of ObjectIds",
      }),
    best: Joi.string().optional(),
    items_count: Joi.number().integer().min(0).default(0).messages({
      "number.base": "Items count must be a number",
      "number.integer": "Items count must be an integer",
      "number.min": "Items count cannot be negative",
    }),
    count: Joi.number().integer().min(0).default(0).messages({
      "number.base": "Count must be a number",
      "number.integer": "Count must be an integer",
      "number.min": "Count cannot be negative",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};
