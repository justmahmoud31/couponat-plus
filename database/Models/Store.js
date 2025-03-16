import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        required: true,
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    }],
    coupons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
    }],
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }],
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Virtuals for dynamic counts
StoreSchema.virtual("numberOfCoupons").get(function () {
    return this.coupons?.length || 0;
});

StoreSchema.virtual("numberOfCategories").get(function () {
    return this.categories?.length || 0;
});

StoreSchema.virtual("numberOfProducts").get(function () {
    return this.products?.length || 0;
});

// Virtual populate for rates
StoreSchema.virtual('rates', {
    ref: 'Rate',
    localField: '_id',
    foreignField: 'store_id',
});

export const Store = mongoose.model("Store", StoreSchema);
