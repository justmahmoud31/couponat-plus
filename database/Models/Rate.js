import mongoose from "mongoose";

const rateSchema = mongoose.Schema({
    rateNumber: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
    },
    store_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
}, {
    timestamps: true
});

const Rate = mongoose.model("Rate", rateSchema);
export default Rate;
