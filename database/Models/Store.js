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
    numberOfCoupons: {
        type: Number,
        default: 0,
    },
    numberOfCategories: {
        type: Number,
        default: 0,
    },
    numberOfProducts: {
        type: Number,
        default: 0,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

// Virtual populate for rates
StoreSchema.virtual('rates', {
    ref: 'Rate',
    localField: '_id',
    foreignField: 'store_id',
});

// Middleware to update counts when fields are modified
StoreSchema.pre('save', async function (next) {
    if (this.isModified('coupons')) {
        this.numberOfCoupons = this.coupons.length;
    }
    if (this.isModified('categories')) {
        this.numberOfCategories = this.categories.length;
    }
    if (this.isModified('products')) {
        this.numberOfProducts = this.products.length;
    }
    next();
});

export const Store = mongoose.model("Store", StoreSchema);
