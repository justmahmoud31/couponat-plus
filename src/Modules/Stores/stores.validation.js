import Joi from 'joi';

export const storeValidationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Store name is required',
      'any.required': 'Store name is required'
    }),

  description: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Description is required',
      'any.required': 'Description is required'
    }),

  link: Joi.string()
    .trim()
    .uri()
    .required()
    .messages({
      'string.empty': 'Valid URL is required',
      'string.uri': 'Invalid URL format',
      'any.required': 'URL is required'
    }),

  rate: Joi.number()
    .min(0)
    .max(5)
    .default(0)
    .messages({
      'number.min': 'Rate must be at least 0',
      'number.max': 'Rate must be at most 5'
    }),

  categories: Joi.array()
    .items(Joi.string())
    .optional(),

  coupons: Joi.array()
    .items(Joi.string())
    .optional()
});

export const validateStore = (data) => {
  return storeValidationSchema.validate(data, { 
    abortEarly: false, 
    convert: true 
  });
};
