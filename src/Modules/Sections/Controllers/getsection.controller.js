import { Section } from "../../../../database/Models/Section.js";
import { Category } from "../../../../database/Models/Category.js";
import { Coupon } from "../../../../database/Models/Coupon.js";
import { Store } from "../../../../database/Models/Store.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { Product } from "../../../../database/Models/Product.js";
import { Event } from "../../../../database/Models/Events.js";
import mongoose from "mongoose";

const fetchFullCategories = async (categoryIds) => {
  try {
    const categories = await Category.aggregate([
      {
        $match: {
          _id: {
            $in: categoryIds.map((id) =>
              mongoose.Types.ObjectId.isValid(id)
                ? new mongoose.Types.ObjectId(id)
                : id
            ),
          },
        },
      },
      {
        $lookup: {
          from: "categories", // collection name in MongoDB
          localField: "parent_id",
          foreignField: "_id",
          as: "parent_info",
        },
      },
      {
        $lookup: {
          from: "categories", // collection name in MongoDB
          localField: "sub_categories",
          foreignField: "_id",
          as: "sub_categories_info",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          image: 1,
          best: 1,
          parent_id: 1,
          sub_categories: 1,
          count: 1,
          createdAt: 1,
          updatedAt: 1,
          parent_info: 1,
          sub_categories_info: 1,
        },
      },
    ]);

    console.log(`Fetched ${categories.length} categories with all fields`);
    // Log the first category to verify all fields are present
    if (categories.length > 0) {
      console.log("First category:", JSON.stringify(categories[0], null, 2));
    }

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

const fetchCouponsWithDetails = async (couponIds) => {
  try {
    const coupons = await Coupon.find({ _id: { $in: couponIds } })
      .populate({
        path: "store_id",
        select: "name logo numberOfCoupons",
      })
      .populate({
        path: "category_id",
        select: "name slug image",
      });

    const couponsByCategory = {};
    const allCoupons = [];

    for (const coupon of coupons) {
      const couponObj = coupon.toObject();
      allCoupons.push(couponObj);

      if (coupon.category_id) {
        const categoryId = coupon.category_id._id.toString();
        if (!couponsByCategory[categoryId]) {
          couponsByCategory[categoryId] = {
            _id: categoryId,
            name: coupon.category_id.name,
            slug: coupon.category_id.slug,
            image: coupon.category_id.image,
            coupons: [],
          };
        }
        couponsByCategory[categoryId].coupons.push(couponObj);
      }
    }

    const categories = Object.values(couponsByCategory);

    return {
      coupons: allCoupons,
      couponsByCategory: categories,
    };
  } catch (error) {
    console.error("Error fetching coupons with details:", error);
    return { coupons: [], couponsByCategory: [] };
  }
};

const fetchEventsWithDetails = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } }).populate({
      path: "category_id",
      select: "name slug image",
    });

    const eventsByCategory = {};
    const allEvents = [];

    for (const event of events) {
      const eventObj = event.toObject();
      allEvents.push(eventObj);

      if (event.category_id) {
        const categoryId = event.category_id._id.toString();
        if (!eventsByCategory[categoryId]) {
          eventsByCategory[categoryId] = {
            _id: categoryId,
            name: event.category_id.name,
            slug: event.category_id.slug,
            image: event.category_id.image,
            events: [],
          };
        }
        eventsByCategory[categoryId].events.push(eventObj);
      }
    }

    const categories = Object.values(eventsByCategory);

    return {
      events: allEvents,
      categories: categories,
    };
  } catch (error) {
    console.error("Error fetching events with details:", error);
    return { events: [], categories: [] };
  }
};

const getSection = catchError(async (req, res, next) => {
  const { type, isActive } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (isActive !== undefined) filter.isActive = isActive === "true";

  let sections = await Section.find(filter)
    .populate([
      { path: "banner_id", select: "title imageUrl" },
      { path: "store_id", select: "name numberOfCoupons" },
      { path: "category_id", select: "name" },
    ])
    .sort({ order: 1 });

  const processedSections = await Promise.all(
    sections.map(async (section) => {
      const sectionObj = section.toObject();

      if (!section.items || section.items.length === 0) {
        return sectionObj;
      }

      if (section.type === "Categories") {
        const categoryItems = await fetchFullCategories(section.items);
        return {
          ...sectionObj,
          items: categoryItems,
        };
      } else if (section.type === "Coupons") {
        const { coupons, couponsByCategory } = await fetchCouponsWithDetails(
          section.items
        );
        return {
          ...sectionObj,
          items: coupons,
          categories: couponsByCategory,
        };
      } else if (section.type === "Stores") {
        const stores = await Store.find(
          { _id: { $in: section.items } },
          "name logo numberOfCoupons"
        );
        return {
          ...sectionObj,
          items: stores.map((store) => store.toObject()),
        };
      } else if (section.type === "Products") {
        const products = await Product.find(
          { _id: { $in: section.items } },
          "cover_image price"
        );
        return {
          ...sectionObj,
          items: products.map((product) => product.toObject()),
        };
      } else if (section.type === "Events") {
        const { events, categories } = await fetchEventsWithDetails(
          section.items
        );
        return {
          ...sectionObj,
          items: events,
          categories: categories,
        };
      }

      return sectionObj;
    })
  );

  res.status(200).json({
    message: "Sections retrieved successfully",
    count: processedSections.length,
    sections: processedSections,
  });
});

const getActiveSections = catchError(async (req, res, next) => {
  const { type } = req.query;
  const filter = { isActive: true };
  if (type) filter.type = type;

  let sections = await Section.find(filter)
    .populate([
      { path: "banner_id", select: "title imageUrl" },
      { path: "store_id", select: "name numberOfCoupons" },
      { path: "category_id", select: "name" },
    ])
    .sort({ order: 1 });

  const processedSections = await Promise.all(
    sections.map(async (section) => {
      const sectionObj = section.toObject();

      if (!section.items || section.items.length === 0) {
        return sectionObj;
      }

      if (section.type === "Categories") {
        const categoryItems = await fetchFullCategories(section.items);
        return {
          ...sectionObj,
          items: categoryItems,
        };
      } else if (section.type === "Coupons") {
        const { coupons, couponsByCategory } = await fetchCouponsWithDetails(
          section.items
        );
        return {
          ...sectionObj,
          items: coupons,
          categories: couponsByCategory,
        };
      } else if (section.type === "Stores") {
        const stores = await Store.find(
          { _id: { $in: section.items } },
          "name logo numberOfCoupons"
        );
        return {
          ...sectionObj,
          items: stores.map((store) => store.toObject()),
        };
      } else if (section.type === "Products") {
        const products = await Product.find(
          { _id: { $in: section.items } },
          "cover_image price"
        );
        return {
          ...sectionObj,
          items: products.map((product) => product.toObject()),
        };
      } else if (section.type === "Events") {
        const { events, categories } = await fetchEventsWithDetails(
          section.items
        );
        return {
          ...sectionObj,
          items: events,
          categories: categories,
        };
      }

      return sectionObj;
    })
  );

  res.status(200).json({
    message: "Active sections retrieved successfully",
    count: processedSections.length,
    sections: processedSections,
  });
});

export default { getSection, getActiveSections };
