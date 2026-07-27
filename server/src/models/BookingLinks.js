import mongoose from "mongoose";

const BookingLinksSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    host: { type: mongoose.Schema.Types.Mixed, required: true },
});

export const BookingLinks = mongoose.model("BookingLinks", BookingLinksSchema);

