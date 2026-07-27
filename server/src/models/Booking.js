import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    email: { type: String, required: true },
    BookingId: { type: String, required: true },
    Date: { type: String, required: true },
    StartTime: { type: String, required: true },
    EndTime: { type: String, required: true }
});

export const Booking = mongoose.model("Booking", bookingSchema);