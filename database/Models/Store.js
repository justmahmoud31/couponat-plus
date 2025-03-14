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
    coupons: [{   // ✅ Add coupons field
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
    }],
    products: [{  // ✅ Add products field
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }],
    numberOfCoupons: {
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



// Middleware to update numberOfCoupons when coupons are modified
StoreSchema.pre('save', async function (next) {
    if (this.isModified('coupons')) {
        this.numberOfCoupons = this.coupons.length;
    }
    next();
});

export const Store = mongoose.model("Store", StoreSchema);
