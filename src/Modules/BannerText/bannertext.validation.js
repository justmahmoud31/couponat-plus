import Joi from "joi";

export const bannerTextValidation = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(""),
    link: Joi.string().uri().allow(""),
});
