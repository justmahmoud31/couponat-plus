import { Offer } from "../../../database/Models/Offer.js";
import { AppError } from "../../Utils/AppError.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllOffers = async (req, res, next) => {
  try {
    const {
      search,
      isDeleted,
      store_id,
      category_id,
      isActive,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (isDeleted !== undefined) {
      query.isDeleted = isDeleted === "true";
    }

    if (store_id) {
      query.store_id = store_id;
    }

    if (category_id) {
      query.category_id = category_id;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    // Count total documents for pagination
    const totalCount = await Offer.countDocuments(query);

    // Setup pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build sort options
    let sortOptions = {};
    if (sort) {
      // Handle descending sort (fields prefixed with -)
      if (sort.startsWith("-")) {
        sortOptions[sort.substring(1)] = -1;
      } else {
        sortOptions[sort] = 1;
      }
    } else {
      // Default sort by createdAt in descending order
      sortOptions = { createdAt: -1 };
    }

    // Apply query, sort, pagination, and populate
    let offersQuery = Offer.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate("store_id", "name logo")
      .populate("category_id", "name slug image");

    const offers = await offersQuery;

    // Format offers to match the expected structure in frontend
    const formattedOffers = offers.map((offer) => {
      const offerObj = offer.toObject();

      // Ensure discount field (frontend expects this)
      if (offerObj.discountPercentage !== undefined && !offerObj.discount) {
        offerObj.discount = offerObj.discountPercentage;
      }

      // Ensure cover_image field (frontend expects this)
      if (offerObj.image && !offerObj.cover_image) {
        offerObj.cover_image = offerObj.image;
      }

      return offerObj;
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.status(200).json({
      success: true,
      count: formattedOffers.length,
      offers: formattedOffers,
      pagination: {
        totalCount,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Error in getAllOffers:", error);
    next(new AppError(error.message, 500));
  }
};

export const getOfferById = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate("store_id", "name logo")
      .populate("category_id", "name slug image");

    if (!offer) {
      return next(new AppError("Offer not found", 404));
    }

    const formattedOffer = offer.toObject();

    if (
      formattedOffer.discountPercentage !== undefined &&
      !formattedOffer.discount
    ) {
      formattedOffer.discount = formattedOffer.discountPercentage;
    }

    if (formattedOffer.image && !formattedOffer.cover_image) {
      formattedOffer.cover_image = formattedOffer.image;
    }

    res.status(200).json({
      success: true,
      data: formattedOffer,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const getOfferBySlug = async (req, res, next) => {
  try {
    const offer = await Offer.findOne({
      slug: req.params.slug,
      isDeleted: false,
    })
      .populate("store_id", "name logo slug")
      .populate("category_id", "name slug image");

    if (!offer) {
      return next(new AppError("Offer not found", 404));
    }

    const formattedOffer = offer.toObject();

    if (
      formattedOffer.discountPercentage !== undefined &&
      !formattedOffer.discount
    ) {
      formattedOffer.discount = formattedOffer.discountPercentage;
    }

    if (formattedOffer.image && !formattedOffer.cover_image) {
      formattedOffer.cover_image = formattedOffer.image;
    }

    res.status(200).json({
      success: true,
      data: formattedOffer,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const createOffer = async (req, res, next) => {
  try {
    const { title, store_id } = req.body;

    if (!title || !store_id) {
      const errors = {};
      if (!title) errors.title = "Title is required";
      if (!store_id) errors.store_id = "Store is required";

      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        errors,
      });
    }

    const offerData = {
      ...req.body,
      image: req.file ? req.file.path : null,
      isActive: true,
    };

    const newOffer = await Offer.create(offerData);

    res.status(201).json({
      success: true,
      data: newOffer,
    });
  } catch (error) {
    console.error("Error creating offer:", error);

    // Handle duplicate key error for slug
    if (error.code === 11000 && error.keyPattern && error.keyPattern.slug) {
      const duplicateValue = error.keyValue.slug;

      return res.status(409).json({
        success: false,
        message: "عنوان العرض مستخدم بالفعل. يرجى اختيار عنوان آخر.",
        errors: {
          title: "هذا العنوان مستخدم بالفعل، اختر عنوانًا آخر",
        },
        errorCode: "DUPLICATE_SLUG",
        duplicateField: "title",
        duplicateValue,
      });
    }

    // Better handle validation errors
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }

      console.log("Mongoose validation error:", errors);

      return res.status(400).json({
        success: false,
        message: error.message,
        errors,
      });
    }

    next(new AppError(error.message, 500));
  }
};

export const updateOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!offer) {
      return next(new AppError("Offer not found", 404));
    }

    res.status(200).json({
      success: true,
      data: offer,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const deleteOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, isActive: false },
      { new: true }
    );

    if (!offer) {
      return next(new AppError("Offer not found", 404));
    }

    res.status(200).json({
      success: true,
      data: offer,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const restoreOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true }
    );

    if (!offer) {
      return next(new AppError("Offer not found", 404));
    }

    res.status(200).json({
      success: true,
      data: offer,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const permanentlyDeleteOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return next(new AppError("Offer not found", 404));
    }

    if (offer.image) {
      try {
        const imagePath = path.join(process.cwd(), "uploads", offer.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (err) {
        console.error("Error deleting image file:", err);
      }
    }

    await Offer.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const trackViewOffer = async (req, res, next) => {
  try {
    const offerId = req.params.id;

    const offer = await Offer.findByIdAndUpdate(
      offerId,
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    if (!offer) {
      return next(new AppError("Offer not found", 404));
    }

    res.status(200).json({
      success: true,
      data: {
        viewCount: offer.viewCount,
      },
    });
  } catch (error) {
    console.error("Error tracking offer view:", error);
    next(new AppError(error.message, 500));
  }
};

export const activateOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!offer) {
      return next(new AppError("Offer not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "تم تفعيل العرض بنجاح",
      data: offer,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const deactivateOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!offer) {
      return next(new AppError("Offer not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "تم إلغاء تفعيل العرض بنجاح",
      data: offer,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
