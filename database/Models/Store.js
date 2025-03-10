import mongoose from "mongoose";

// Store Schema
const StoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }],
  coupons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon"
  }],
  rates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rate"
  }],
  numberOfCoupons: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Middleware to update numberOfCoupons when coupons are modified
StoreSchema.pre('save', async function (next) {
  if (this.isModified('coupons')) {
    this.numberOfCoupons = this.coupons.length;
  }
  next();
});

// Methods for vertical population
StoreSchema.methods.populateCategories = async function () {
  return await this.populate('categories');
};

StoreSchema.methods.populateCoupons = async function () {
  return await this.populate('coupons');
};

// Virtual method to populate both categories and coupons
StoreSchema.methods.populateAll = async function () {
  return await this.populate('categories coupons');
};

export const Store = mongoose.model("Store", StoreSchema);