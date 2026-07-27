import mongoose from "mongoose";

const AvailablitySchema = new mongoose.Schema({
    Host: { type: mongoose.Schema.Types.Mixed, required: true },
    BookingId: { type: String, default: null },
    Date: { type: String, required: true },
    StartTime: { type: String, required: true },
    EndTime: { type: String, required: true }
});

export const Availablity = mongoose.model("Availablity", AvailablitySchema);