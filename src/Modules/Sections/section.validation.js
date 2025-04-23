import Joi from "joi";
import mongoose from "mongoose";

// Helper to validate ObjectId
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId Validation");

export const sectionValidation = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "Title is required",
    "string.empty": "Title cannot be empty",
  }),
  description: Joi.string().allow(null, ""),
  banner_id: objectId.allow(null, ""),
  store_id: objectId.allow(null, ""),
  text: Joi.string().allow(null, ""),
  type: Joi.string()
    .valid(
      "Slider",
      "BannerText",
      "Categories",
      "Coupons",
      "Events",
      "Marketing",
      "Stores",
      "TwoBanner",
      "Products",
      "bestStoresCategories",
      "bestCouponCategories",
      "bestDealsCategory"
    )
    .required()
    .messages({
      "any.required": "Type is required",
      "any.only":
        "Type must be one of Slider, BannerText, Categories, Coupons, Events, Marketing, Stores, TwoBanner, Products, bestStoresCategories, bestCouponCategories, bestDealsCategory",
    }),
  category_id: objectId.allow(null, ""),
  items: Joi.alternatives().conditional("type", {
    is: Joi.valid(
      "Categories",
      "Coupons",
      "Stores",
      "Products",
      "Events",
      "Slider",
      "BannerText",
      "TwoBanner"
    ),
    then: Joi.array().items(objectId).min(1).required().messages({
      "array.min": "At least one item is required for this type",
      "any.required": "Items are required for this type",
    }),
    otherwise: Joi.forbidden(),
  }),
  order: Joi.number().integer().min(1).required(),
  isActive: Joi.bool(),
});
