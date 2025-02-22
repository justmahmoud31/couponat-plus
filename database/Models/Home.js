import mongoose from "mongoose";

const HomeSchema = new mongoose.Schema({
    section_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }],
});
export const Home = mongoose.model("Home", HomeSchema);